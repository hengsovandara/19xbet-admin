#!/bin/bash

tag="$1"

cd /opt/WebApp/

git clone git@github.com:clik-asia/WebApp.git
git checkout tags/${tag} -b staging 

/root/.nvm/versions/node/v11.1.0/bin/npm install
/root/.nvm/versions/node/v11.1.0/bin/npm run build
/root/.nvm/versions/node/v11.1.0/bin/npm start

#cat /etc/*release
