#!/bin/bash

apt update
apt upgrade
apt install -y curl
curl -sL https://deb.nodesource.com/setup_8.x | bash
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
apt update
apt install -y build-essential
apt install -y git
apt install -y python
apt install -y nodejs
apt install -y yarn
apt install -y libcairo2-dev
apt install -y libjpeg8-dev
apt install -y libpango1.0-dev
apt install -y libgif-dev
apt install -y g++
apt install -y libtool
apt install -y autoconf
apt install -y automake
apt install -y postgresql
apt install -y postgresql-contrib
apt install -y redis-server
python -mplatform | grep -qi Ubuntu && apt install -y ffmpeg
python -mplatform | grep -qi debian && apt install -y libav-tools
update-rc.d postgresql enable
service postgresql start
update-rc.d redis-server enable
service redis-server start
yarn global add node-gyp pm2
apt autoremove -y

if [ ! -f /assets/_data/settings.json ]; then
    cp /assets/_data/settings.json.example /assets/_data/settings.json
fi

yarn install
yarn run test

echo "Now create a database in postgresql and fill out settings.json in assets/_data/"
sleep 10