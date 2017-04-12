const { Command } = require('discord.js-commando');
const { colorOk, colorInfo } = require('../../settings.json');

module.exports = class SetUserLevelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'set-user-level',
			aliases: ['sul'],
			group: 'util',
			memberName: 'set-user-level',
			description: 'Set command access level',
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 5
			},

			args: [
				{
					key: 'job',
					prompt: 'get or set?',
					type: 'string',
					validate: job => {
						if (job.toLowerCase() !== 'get' && job.toLowerCase() !== 'set') {
							return `Job name must be 'get' or 'set'`;
						}
						return true;
					}
				},

				{
					key: 'user',
					prompt: 'what user level should get changed?\n',
					type: 'user'
				},

				{
					key: 'level',
					prompt: 'what level you want to set?(from 0 to 100)',
					type: 'integer',
					default: 0,
					min: 0,
					max: 100,
					wait: 10
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

	async run(msg, args) {
		const job = args.job.toLowerCase() === 'get';
		const { user, level } = args;
		const userLevel = this.client.provider.get(user.id, 'userLevel');
		if (job) {
			if (userLevel === undefined) {
				return this.client.provider.set(user.id, 'userLevel', 0).then(() => {
					msg.embed({ color: colorInfo, description: `${user} doesn't have ul. Setting ul to 0` });
				});
			}
			return msg.embed({ color: colorOk, description: `${user} ul - ${userLevel}` });
		} else {
			this.client.provider.set(user.id, 'userLevel', level);
			return msg.embed(
				{
					color: colorOk,
					description: `You have been set ${level} ul to ${user.username}#${user.discriminator}`
				});
		}
	}
};
