[![GitHub issues](https://img.shields.io/github/issues/iSm1le/Naomi-Tanizaki.svg?style=flat-square)](https://github.com/iSm1le/Naomi-Tanizaki/issues)
[![GitHub forks](https://img.shields.io/github/forks/iSm1le/Naomi-Tanizaki.svg?style=flat-square)](https://github.com/iSm1le/Naomi-Tanizaki/network)
[![GitHub stars](https://img.shields.io/github/stars/iSm1le/Naomi-Tanizaki.svg?style=flat-square)](https://github.com/iSm1le/Naomi-Tanizaki/stargazers)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/iSm1le/Naomi-Tanizaki/master/LICENSE)
[![dependencies Status](https://david-dm.org/iSm1le/Naomi-Tanizaki/status.svg?style=flat-square)](https://david-dm.org/iSm1le/Naomi-Tanizaki)
[![Build Status](https://travis-ci.org/iSm1le/Naomi-Tanizaki.svg?branch=master)](https://travis-ci.org/iSm1le/Naomi-Tanizaki)
# Naomi-Tanizaki

## Installation guide for Ubuntu 16.04.2 LTS && Debian >7

#### Install node.js version >7.6.0

```bash
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
> 7.6.0
```

#### Install PostgresSQL
If Postgres is not installed yet, follow these steps. If it is already installed, you should create a new db or use an existing one.

```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo update-rc.d postgresql enable
```

#### Create postgres user
```bash
sudo su
sudo -i -u postgres
createuser -P --interactive <user_name>
createdb <db_name>
```

#### Install Redis
```bash
sudo apt-get update
sudo apt-get install redis-server
sudo update-rc.d redis-server enable
```

#### Install required libraries
```bash
sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++
```

On debian you need to install ffmpeg, or install newer library. (it`s called libav, if i am correct)

#### Intall git if you dont have it
```bash
sudo apt-get install git
```

#### Clone source and install dependencies(with admin privileges)
```bash
git clone https://github.com/iSm1le/Naomi-Tanizaki.git
sudo npm i
```

#### Clone settings
```bash
cp settings.json.example settings.json
```

After you clone the settings, edit them with your connection information. You'll also need to grab your bot token from the discord api page

### Launch bot
So, if you dont have pm2 you can just write
```bash
node bot.js
```

You can install pm2. It also helps run it in other process than terminal.
```bash
sudo npm i  -g pm2
```

Add pm2 to startup. Run the command from output of this command.
```bash
pm2 startup
```

Run with pm2
```bash
pm2 start bot.js
```

And you can autolaunch bot.
```bash
pm2 save
```
