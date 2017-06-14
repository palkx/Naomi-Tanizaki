const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const _sdata = require('../../assets/_data/static_data.json');
module.exports = class BlacklistUserCommand extends Command {
	constructor (client) {
		super(client, {
			name: 'blacklist-user',
			aliases: ['blacklist'],
			group: 'util',
			memberName: 'blacklist-user',
			description: '`AL: full` Prohibit a user from using commando',
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'user',
					prompt: 'whom do you want to blacklist?\n',
					type: 'user'
				}
			]
		});
	}

	hasPermission (msg) {
		return this.client.isOwner(msg.author)
			|| this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.full;
	}

	run (msg, { user }) {
		if (this.client.isOwner(user.id)) {
			return msg.embed({
				color: _sdata.colors.blue,
				description: `${msg.author},  the bot owner can not be blacklisted.`
			});
		}

		const blacklist = this.client.provider.get('global', 'userBlacklist', []);
		if (blacklist.includes(user.id)) {
			return msg.embed({
				color: _sdata.colors.blue,
				description: `${msg.author},  that user is already blacklisted.`
			});
		}

		blacklist.push(user.id);
		this.client.provider.set('global', 'userBlacklist', blacklist);
		return msg.embed({
			color: _sdata.colors.blue,
			description: oneLine`
			${msg.author},  ${user.username}#${user.discriminator} has been blacklisted from using ${this.client.user}.`
		});
	}
};
