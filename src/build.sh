!#/bin/bash

git pull
docker system prune -f
docker build . -t 19xbet-admin:latest
cd /etc/hasura
docker-compose down
docker-compose up -d



