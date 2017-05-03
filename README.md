[![GitHub issues](https://img.shields.io/github/issues/iSm1le/Naomi-Tanizaki.svg?style=flat-square)](https://github.com/iSm1le/Naomi-Tanizaki/issues)
[![GitHub forks](https://img.shields.io/github/forks/iSm1le/Naomi-Tanizaki.svg?style=flat-square)](https://github.com/iSm1le/Naomi-Tanizaki/network)
[![GitHub stars](https://img.shields.io/github/stars/iSm1le/Naomi-Tanizaki.svg?style=flat-square)](https://github.com/iSm1le/Naomi-Tanizaki/stargazers)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/iSm1le/Naomi-Tanizaki/master/LICENSE)
[![dependencies Status](https://david-dm.org/iSm1le/Naomi-Tanizaki/status.svg?style=flat-square)](https://david-dm.org/iSm1le/Naomi-Tanizaki)
[![Build Status](https://travis-ci.org/iSm1le/Naomi-Tanizaki.svg?branch=master)](https://travis-ci.org/iSm1le/Naomi-Tanizaki)
# Naomi-Tanizaki

## Installation guide for Ubuntu 16.04 LTS and Debian >7

#### Run install.sh
```bash
sudo chmod +x install.sh
./install.sh
```

#### Create postgres user and database
```bash
sudo su
sudo -i -u postgres
createuser -P --interactive user_name
createdb db_name
```

## Launch bot
####So, if you dont have pm2 you can just write
```bash
node bot.js
```
####You can install pm2. It also helps run it in other process than terminal.
```bash
sudo npm i  -g pm2
```
####Add pm2 to startup. Run the command from output of this command.
```bash
pm2 startup
```
####Run with pm2
```bash
pm2 start bot.js
```
####And you can autolaunch bot.
```bash
pm2 save
```