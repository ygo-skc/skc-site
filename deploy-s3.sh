#!/bin/bash
# Uploads build/ to an S3 bucket behind CloudFront: deploy-s3.sh <bucket> <cloudfront distribution id>
#
# Bundles have a content hash in their name, so they're cached for a year. index.html is revalidated on every
# visit so it always points at the newest bundles. Old bundles stay in the bucket, so a tab opened before the
# deploy can still load the lazy chunks for pages it hasn't visited yet.
set -euo pipefail

if [ $# -ne 2 ]; then
	echo "Usage: $0 <bucket> <cloudfront distribution id>"
	exit 1
fi

BUCKET=$1
DISTRIBUTION=$2

# bundles first, so the new index.html never points at a file that isn't uploaded yet
aws s3 sync build "s3://${BUCKET}/" --exclude '*' --include '*.js' --cache-control 'public, max-age=31536000, immutable'
aws s3 sync build "s3://${BUCKET}/" --exclude '*.js' --exclude 'index.html' --cache-control 'max-age=3600'
aws s3 cp build/index.html "s3://${BUCKET}/index.html" --cache-control 'no-cache'

aws cloudfront create-invalidation --distribution-id "${DISTRIBUTION}" --paths '/*'
