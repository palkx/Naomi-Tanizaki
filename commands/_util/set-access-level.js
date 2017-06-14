const { Command } = require('discord.js-commando');
const _sdata = require('../../assets/_data/static_data.json');
const { oneLine } = require('common-tags');
const Util = require('../../util/Util');

module.exports = class SetUserLevelCommand extends Command {
	constructor (client) {
		super(client, {
			name: 'set-access-level',
			aliases: ['sal'],
			group: 'util',
			memberName: 'set-access-level',
			description: '`AL: owner` Set command access level',
			guildOnly: true,
			guarded: true,
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
						if (['get', 'set'].includes(job)) {
							return true;
						}
						return `Job name must be **get** or **set**`;
					}
				},

				{
					key: 'user',
					prompt: 'change access level to?\n',
					type: 'user'
				},

				{
					key: 'level',
					prompt: 'what AL you want to set?(from 0 to 100)',
					type: 'integer',
					default: 0,
					min: 0,
					max: 100,
					wait: 10
				}
			]
		});
	}

	hasPermission (msg) {
		return this.client.isOwner(msg.author);
	}

	async run (msg, { job, user, level }) { // eslint-disable-line require-await
		const _job = job.toLowerCase() === 'get';
		const userLevel = this.client.provider.get(user.id, 'userLevel');
		const perm = Util.getPerm();
		let _level = Util.getPerm(_job ? userLevel : level);
		if (_job) {
			if (userLevel === undefined) {
				return this.client.provider.set(user.id, 'userLevel', _sdata.aLevel.zero).then(() => {
					msg.embed({
						color: _sdata.colors.blue,
						description: `${user} doesn't have al. Setting \`AL: zero\``
					});
				});
			}
			return msg.embed({
				color: _sdata.colors.green,
				description: oneLine`${user} \`AL: ${_level}
				${Math.max(...perm.int) < userLevel ? `(${userLevel})` : ``}\``
			});
		} else {
			this.client.provider.set(user.id, 'userLevel', level);
			return msg.embed(
				{
					color: _sdata.colors.green,
					description: oneLine`You have been set \`AL: ${_level}
					${Math.max(...perm.int) < level ? `(${level})` : ``}\` to ${user.username}#${user.discriminator}`
				});
		}
	}
};
