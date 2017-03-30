const { Command } = require('discord.js-commando');

module.exports = class WhitelistRoleRemoveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'whitelist-r-remove',
			group: 'util',
			memberName: 'whitelist-r-remove',
			description: 'Remove a role from the whitelist',
            guildOnly: true,
			throttling: {
				usages: 2,
				duration: 5
			},

			args: [
				{
					key: 'role',
					prompt: 'what role should get removed from the whitelist?\n',
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
		if (!roleWhitelist.includes(role.id)) return msg.embed({ color: 3447003, description: `that role is not whitelisted.`});

		const index = roleWhitelist.indexOf(role.id);
		roleWhitelist.splice(index, 1);

		if (roleWhitelist.length === 0) {
			this.client.provider.remove(msg.guild.id, 'roleWhitelist');
		} else {
			this.client.provider.set(msg.guild.id, 'roleWhitelist', roleWhitelist);
		}

		return msg.embed({ color: 3447003, description: `${role} has been removed from the whitelist.`});
	}
};
