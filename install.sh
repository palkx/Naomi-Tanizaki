#!/bin/bash

sudo apt update
sudo apt upgrade
sudo apt install -y curl
sudo curl -sL https://deb.nodesource.com/setup_7.x | bash
sudo curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
sudo echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
sudo apt update
sudo apt install -y build-essential ffmpeg git python nodejs yarn libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev g++ libtool autoconf automake
sudo update-rc.d postgresql enable
sudo update-rc.d redis-server enable
sudo yarn global add node-gyp pm2
sudo apt autoremove -y

if [ ! -f /assets/_data/settings.json ]; then
    cp /assets/_data/settings.json.example /assets/_data/settings.json
fi

sudo yarn install
yarn run test

echo "Now create a database in postgresql and fill out settings.json in assets/_data/"
sleep 10