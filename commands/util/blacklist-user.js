const { Command } = require('discord.js-commando');

module.exports = class BlacklistUserCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'blacklist-user',
			aliases: ['blacklist'],
			group: 'util',
			memberName: 'blacklist-user',
			description: 'Prohibit a user from using commando',
			throttling: {
				usages: 2,
				duration: 5
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

	hasPermission(msg) {
		return this.client.provider.get(msg.author.id, 'userLevel', [])[0]>=5?true:false;
	}

	async run(msg, args) {
		const user = args.user;

		if (this.client.options.owner === user.id) return msg.embed({ color: 3447003, description: `the bot owner can not be blacklisted.`});
		if(msg.author.id === user.id) return msg.embed({ color: 3447003, description: `you cant blacklist yourself.`});

		const blacklist = this.client.provider.get('global', 'userBlacklist', []);
		if (blacklist.includes(user.id)) return msg.embed({ color: 3447003, description: `that user is already blacklisted.`});

		blacklist.push(user.id);
		this.client.provider.set('global', 'userBlacklist', blacklist);

		return msg.embed({ color: 3447003, description: `${user.username}#${user.discriminator} has been blacklisted from using ${this.client.user}.`});
	}
};
