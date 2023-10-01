SERVER=$1
USER="ec2-user"
DIR_ON_SERVER="skc-site"

if [ $# -eq 0 ]
	then
		echo "Need server name"
fi

rsync -avz --progress --delete -e "ssh -i ~/.ssh/skc-server.pem" docker-compose.yaml nginx.conf build "${USER}@${SERVER}:${DIR_ON_SERVER}/"