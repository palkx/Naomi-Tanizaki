# THIS PROJECT IS DEPRECATED AND MOVED TO [gitlab](https://gitlab.com/iSm1le/Naomi-Tanizaki)

# Naomi-Tanizaki

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Installation guide for Ubuntu 16.04 LTS and Debian 8

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
#### So, if you dont have pm2 you can just write
```bash
node bot.js
```
#### You can install pm2. It also helps run it in other process than terminal.
```bash
sudo npm i  -g pm2
```
#### Add pm2 to startup. Run the command from output of this command.
```bash
pm2 startup
```
#### Run with pm2
```bash
pm2 start bot.js
```
#### And you can autolaunch bot.
```bash
pm2 save
```
## Author
© **[iSm1le](https://github.com/iSm1le/)**, Released under the [MIT](https://github.com/iSm1le/Naomi-Tanizaki/blob/master/LICENSE) License.<br>
Authored and maintained by iSm1le.
