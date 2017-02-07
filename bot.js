const commando = require('discord.js-commando');
const { oneLine } = require('common-tags');
const path = require('path');
const mongoose = require('mongoose');
const winston = require('winston');

const config = require('./config/conf.json');

const client = new commando.Client({
    owner: config.owner,
    commandPrefix: config.commandPrefix,
    unknownCommandResponse: false,
    disableEveryone: true
})

client.on('error', winston.error)
          .on('warn', winston.warn)
          .on('ready', () => {
              winston.info(oneLine`
              Client ready. Logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})
              `);
          })
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

client.registry
	.registerGroups([
		['misc', 'Misc']
	])
	.registerDefaults()
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.login(config.token);
