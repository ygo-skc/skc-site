if [ $# -eq 0 ]
	then
		echo "Need server name"
		exit 1
fi

SERVER=$1
USER="ec2-user"
DIR_ON_SERVER="skc-site"

echo "Using server $SERVER and directory $DIR_ON_SERVER to sync prod API"

echo "Uploading API files"
rsync -avzh --delete --progress --delete -e "ssh -i ~/.ssh/skc-server.pem" docker-compose.yaml nginx.conf build "${USER}@${SERVER}:${DIR_ON_SERVER}/"

echo -e "\n\nRestaging API"
ssh -i ~/.ssh/skc-server.pem "${USER}@${SERVER}" << EOF
	cd skc-site
	docker-compose kill
	docker-compose rm -f
	docker-compose pull
	docker-compose up -d
EOF

