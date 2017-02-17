const { Command } = require('discord.js-commando');

module.exports = class WhitelistRoleAddCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'whitelist-r-add',
			group: 'moderation',
			memberName: 'whitelist-r-add',
			description: 'Add role to a whitelist',
            guildOnly: true,
			throttling: {
				usages: 2,
				duration: 5
			},

			args: [
				{
					key: 'role',
					prompt: 'what role should get added to the whitelist?\n',
					type: 'string'
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.provider.get(msg.author.id, 'userLevel', [])[0]>=2?true:false;
	}

	async run(msg, args) {
        let role = msg.guild.roles.find('name', args.role);
        if(!role) { return msg.embed({ color: 3447003, description: `${args.role} group not exist on server`}); }

		const roleWhitelist = this.client.provider.get(msg.guild.id, 'roleWhitelist', []);
		if (roleWhitelist.includes(role.id)) return msg.embed({ color: 3447003, description: 'that role is already whitelisted.'});

		roleWhitelist.push(role.id);
		this.client.provider.set(msg.guild.id, 'roleWhitelist', roleWhitelist);

		return msg.embed({ color: 3447003, description: `${role} has been add to the whitelist.`});
	}
};
