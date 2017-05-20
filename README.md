[![GitHub issues](https://img.shields.io/github/issues/iSm1le/Naomi-Tanizaki.svg?style=flat-square)](https://github.com/iSm1le/Naomi-Tanizaki/issues)
[![GitHub forks](https://img.shields.io/github/forks/iSm1le/Naomi-Tanizaki.svg?style=flat-square)](https://github.com/iSm1le/Naomi-Tanizaki/network)
[![GitHub stars](https://img.shields.io/github/stars/iSm1le/Naomi-Tanizaki.svg?style=flat-square)](https://github.com/iSm1le/Naomi-Tanizaki/stargazers)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/iSm1le/Naomi-Tanizaki/master/LICENSE)
[![dependencies Status](https://david-dm.org/iSm1le/Naomi-Tanizaki/status.svg?style=flat-square)](https://david-dm.org/iSm1le/Naomi-Tanizaki)
[![Build Status](https://travis-ci.org/iSm1le/Naomi-Tanizaki.svg?branch=master)](https://travis-ci.org/iSm1le/Naomi-Tanizaki)
# Naomi-Tanizaki

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

I think if you choosing this version you know how to start it. To start this version you need to:

#### Install Docker
```bash
sudo apt-get update
sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
sudo apt-add-repository 'deb https://apt.dockerproject.org/repo ubuntu-xenial main'
sudo apt-get update
sudo apt-get install -y docker-engine
```

#### Install docker-compose
```bash
sudo pip install docker-compose
```

#### Clone settings
```bash
cp docker-compose.yml.example docker-compose.yml
```

#### Get ready
```bash
wget https://github.com/iSm1le/Naomi-Tanizaki/blob/beta-docker/docker-compose.yml.exaple -O docker-compose.yml
```

***Fill out all the needed ENV variables.***

#### Launch docker-compose

```bash
docker-compose up -d
```

```bash
docker.sh
```

## Author
**[iSm1le](https://github.com/iSm1le/)** © , Released under the [MIT](https://github.com/iSm1le/Naomi-Tanizaki/blob/master/LICENSE) License.<br>
Authored and maintained by iSm1le.
