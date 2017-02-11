global.Promise = require('bluebird');
const commando = require('discord.js-commando');
const { oneLine } = require('common-tags');
const path = require('path');
const winston = require('winston');
const sqlite = require('sqlite');

const config = require('./config/conf.json');
const version = require('./package.json').version;

const client = new commando.Client({
    autoreconnect: true,
    owner: config.owner,
    commandPrefix: config.commandPrefix,
    unknownCommandResponse: false,
    disableEveryone: true,
    disableEvenets: ['typingStart', 'typingStop', 'guildMemberSpeaking', 'messageUpdate']
});

client.setProvider(
    sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new commando.SQLiteProvider(db))
).catch(console.error);

client.dispatcher.addInhibitor(msg => {
	const blacklist = client.provider.get('global', 'userBlacklist', []);

	if (!blacklist.includes(msg.author.id)) return false;

	return `User ${msg.author.username}#${msg.author.discriminator} (${msg.author.id}) has been blacklisted.`;
});

client.on('error', winston.error)
          .on('warn', winston.warn)
          .on('ready', () => {
              winston.info(oneLine`
              Client ready. Logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})
              `);
              client.user.setGame(`${version} | ${config.commandPrefix}help | ${client.guilds.array().length} Servers`);
          })
          /*.on('guildCreate', (Guild) => {
          })
          .on('guildDelete', (Guild) => {
          })
          .on('guildMemberAdd', (g, m) => {
          })
          .on('guildMemberRemove', (g, m) => {
          })*/
          .on('disconnect', () => {winston.warn('Disconnected!'); })
          .on('reconnect', () => {winston.warn('Reconnecting...'); })
          .on('commandRun', (cmd, promise, msg, args) => {
              winston.info(oneLine`${msg.author.username}#${msg.author.discriminator} (${msg.author.id})
                    > ${msg.guild ? `${msg.guild.name} (${msg.guild.id})` : 'DM'}
                    >> ${cmd.groupID}:${cmd.memberName}
                    ${Object.values(args)[0] !== '' ? `>>> ${Object.values(args)}` : ''}
                `);
          })
          .on('message', async(message) => {
              if (message.channel.type === 'dm') return;

              if (message.author.bot) return;

          })
          .on('commandError', (cmd,err) => {
              if (err instanceof commando.FriendlyError) return;
              winston.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
          })
          .on('commandBlocked', (msg, reason) => {
              winston.info(oneLine`
                  Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
                  blocked; User ${msg.author.username}#${msg.author.discriminator} (${msg.author.id}): ${reason}
              `);
          })
          .on('commandPrefixChange', (guild, prefix) => {
              winston.info(oneLine `
                    Prefix changed to ${prefix || 'the default'}
                    ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
                  `);
          })
          .on('commandStatusChange', (guild, command, enabled) => {
              winston.info(oneLine`
                    Command ${command.groupID}:${command.memberName}
                    ${enabled ? 'enabled' : 'disabled'}
                    ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
                  `);
          })
          .on('groupStatusChange', (guild, group, enabled) => {
              winston.info(oneLine`
                    Group ${group.id}
                    ${enabled ? 'enabled' : 'disabled'}
                    ${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
                  `);
          });

process.on('SIGINT', () => {
    try {
        client.destroy();
    } catch (e) {
        winston.error(e);
    }
    setTimeout(() => {
        process.exit(0);
    }, 200);
});

client.registry
	.registerGroups([
		['misc', 'Misc'],
        ['moderation', 'Moderation'],
        ['bot','Bot'],
        ['user', 'User']
	])
	.registerDefaults()
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.login(config.token);
