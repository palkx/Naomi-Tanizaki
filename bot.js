global.Promise = require('bluebird');

const { CommandoClient, FriendlyError } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const path = require('path');
const winston = require('winston');
const colors = require('./assets/_data/colors.json');
const Database = require('./structures/PostgreSQL');
const Redis = require('./structures/Redis');
const SequelizeProvider = require('./providers/Sequelize');
const Starboard = require('./structures/stars/Starboard');
const { owner, token, commandPrefix } = require('./assets/_data/settings');
const { version, build } = require('./package.json');

const database = new Database();
const redis = new Redis();
const client = new CommandoClient({
	owner,
	commandPrefix: commandPrefix,
	unknownCommandResponse: false,
	disableEveryone: true
});

const Currency = require('./structures/currency/Currency');
const Experience = require('./structures/currency/Experience');
const userName = require('./models/UserName');

let earnedRecently = [];
let gainedXPRecently = [];

database.start();
redis.start();

client.setProvider(new SequelizeProvider(Database.db));

client.dispatcher.addInhibitor(msg => {
	const blacklist = client.provider.get('global', 'userBlacklist', []);
	if (!blacklist.includes(msg.author.id)) return false;
	return `User ${msg.author.username}#${msg.author.discriminator} (${msg.author.id}) has been blacklisted.`;
});

client.on('error', winston.error)
	.on('warn', winston.warn)
	.once('ready', () => Currency.leaderboard())
	.on('ready', () => {
		winston.info(oneLine`
			Client ready... Logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})
		`);
		client.user.setGame(`v${version} b${build}`);
	})
	.on('disconnect', () => winston.warn('Disconnected!'))
	.on('reconnect', () => winston.warn('Reconnecting...'))
	.on('commandRun', (cmd, promise, msg, args) => {
		winston.info(oneLine`${msg.author.username}#${msg.author.discriminator} (${msg.author.id})
			> ${msg.guild ? `${msg.guild.name} (${msg.guild.id})` : 'DM'}
			>> ${cmd.groupID}:${cmd.memberName}
			${Object.values(args)[0] !== '' || [] ? `>>> ${Object.values(args)}` : ''}
		`);
	})
	.on('guildMemberAdd', async member => {
		await member.guild.defaultChannel.send({
			embed: {
				color: colors.green,
				description: `New user joined. Welcome, ${member.user}, to this server.`
			}
		}).catch(err => null); // eslint-disable-line no-unused-vars, handle-callback-err
	})
	.on('guildMemberRemove', async member => {
		await member.guild.defaultChannel.send({
			embed: {
				color: colors.red,
				description: `User leaved. Bye, ${member.user}.`
			}
		}).catch(err => null); // eslint-disable-line no-unused-vars, handle-callback-err
	})
	.on('message', async message => {
		if (message.channel.type === 'dm') return;
		if (message.author.bot) return;

		const channelLocks = client.provider.get(message.guild.id, 'locks', []);
		if (channelLocks.includes(message.channel.id)) return;

		if (!earnedRecently.includes(message.author.id)) {
			const hasImageAttachment = message.attachments.some(attachment =>
				attachment.url.match(/\.(png|jpg|jpeg|gif|webp)$/)
			);
			const moneyEarned = hasImageAttachment
				? Math.ceil(Math.random() * 7) + 5
				: Math.ceil(Math.random() * 7) + 1;

			Currency._changeBalance(message.author.id, moneyEarned);

			earnedRecently.push(message.author.id);
			setTimeout(() => {
				const index = earnedRecently.indexOf(message.author.id);
				earnedRecently.splice(index, 1);
			}, 8000);
		}

		if (!gainedXPRecently.includes(message.author.id)) {
			const xpEarned = Math.ceil(Math.random() * 9) + 3;
			const oldLevel = await Experience.getLevel(message.author.id);

			Experience.addExperience(message.author.id, xpEarned).then(async () => {
				const newLevel = await Experience.getLevel(message.author.id);

				if (newLevel > oldLevel) {
					Currency._changeBalance(message.author.id, 100 * newLevel);
				}
			}).catch(err => null); // eslint-disable-line no-unused-vars, handle-callback-err

			gainedXPRecently.push(message.author.id);
			setTimeout(() => {
				const index = gainedXPRecently.indexOf(message.author.id);
				gainedXPRecently.splice(index, 1);
			}, 60 * 1000);
		}
	})
	.on('messageReactionAdd', async (reaction, user) => {
		if (reaction.emoji.name !== '⭐') return;
		const { message } = reaction;
		const starboard = message.guild.channels.find('name', 'starboard');
		if (!starboard) {
			return message.channel.send({ // eslint-disable-line consistent-return
				embed: {
					color: colors.blue,
					description: `${user}, can't star things without a #starboard...`
				}
			});
		}
		const isAuthor = await Starboard.isAuthor(message.id, user.id);
		if (isAuthor || message.author.id === user.id) {
			return message.channel.send({ // eslint-disable-line consistent-return
				embed: {
					color: colors.red,
					description: `${user}, you can't star your own messages.`
				}
			});
		}
		const hasStarred = await Starboard.hasStarred(message.id, user.id);
		if (hasStarred) {
			return message.channel.send({ // eslint-disable-line consistent-return
				embed: {
					color: colors.red,
					description: `${user}, you've already starred this message.`
				}
			});
		}
		const isStarred = await Starboard.isStarred(message.id);
		if (isStarred) return Starboard.addStar(message, starboard, user.id); // eslint-disable-line
		Starboard.createStar(message, starboard, user.id);
	})
		.on('messageReactionRemove', async (reaction, user) => {
			if (reaction.emoji.name !== '⭐') return;
			const { message } = reaction;
			const starboard = message.guild.channels.find('name', 'starboard');
			if (!starboard) {
				return message.channel.send({ // eslint-disable-line consistent-return
					embed: {
						color: colors.blue,
						description: `${user}, you can't unstar things without a #starboard...`
					}
				});
			}
			const hasStarred = await Starboard.hasStarred(message.id, user.id);
			if (!hasStarred) {
				return message.channel.send({ // eslint-disable-line consistent-return
					embed: {
						color: colors.red,
						description: `${user}, you never starred this message.`
					}
				});
			}
			Starboard.removeStar(message, starboard, user.id);
		})
	.on('unknownCommand', msg => {
		if (msg.channel.type === 'dm') return;
		if (msg.author.bot) return;

		const args = { name: msg.content.split(client.commandPrefix)[1] };
		client.registry.resolveCommand('tags:tag').run(msg, args);
	})
	.on('commandError', (cmd, err) => {
		if (err instanceof FriendlyError) return;
		winston.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
	})
	.on('commandBlocked', (msg, reason) => {
		winston.info(oneLine`
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; User ${msg.author.username}#${msg.author.discriminator} (${msg.author.id}): ${reason}
		`);
	})
	.on('commandPrefixChange', (guild, prefix) => {
		winston.info(oneLine`
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
	})
	.on('userUpdate', (oldUser, newUser) => {
		if (oldUser.username !== newUser.username) {
			userName.create({ userID: newUser.id, username: oldUser.username }).catch(err => null); // eslint-disable-line no-unused-vars, handle-callback-err, max-len
		}
	});

client.registry
	.registerGroups([
		['anime', 'Anime'],
		['bot', 'Bot'],
		['economy', 'Economy'],
		['fun', 'Fun'],
		['games', 'Games'],
		['info', 'Info'],
		['item', 'Item'],
		['music', 'Music'],
		['nsfw', 'NSFW'],
		['rep', 'Reputation'],
		['social', 'Social'],
		['stars', 'Stars'],
		['tags', 'Tags'],
		['util', 'Utility'],
		['weather', 'Weather']
	])
	.registerDefaults()
	.registerTypesIn(path.join(__dirname, 'types'))
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.login(token);
