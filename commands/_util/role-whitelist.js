const { Command } = require('discord.js-commando');
const { winston } = require('winston');

module.exports = class RoleWhitelistCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'role-whitelist',
			group: 'util',
			memberName: 'role-whitelist',
			description: 'Add/remove role to/from a whitelist',
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 5
			},

			args: [
				{
					key: 'job',
					prompt: 'add or remove role?',
					type: 'string',
					validate: job => {
						if (job.toLowerCase() !== 'add' && job.toLowerCase() !== 'remove') {
							return `Job name must be add or remove`;
						}
						return true;
					}
				},

				{
					key: 'role',
					prompt: 'what role?\n',
					type: 'string'
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.provider.get(msg.author.id, 'userLevel', [])[0] >= 3;
	}

	async run(msg, args) {
		try {
			let role = msg.guild.roles.find('name', args.role);
			if (!role) { return msg.embed({ color: 3447003, description: `${args.role} group is not exist on server` }); }
			const job = args.job.toLowerCase() === 'add';

			const roleWhitelist = this.client.provider.get(msg.guild.id, 'roleWhitelist', []);
			if (job) {
				if (roleWhitelist.includes(role.id)) {
					return msg.embed({ color: 3447003, description: `${role} is already whitelisted.` });
				}

				roleWhitelist.push(role.id);
				this.client.provider.set(msg.guild.id, 'roleWhitelist', roleWhitelist);

				return msg.embed({ color: 3447003, description: `${role} has been add to the whitelist.` });
			} else {
				if (!roleWhitelist.includes(role.id)) {
					return msg.embed({ color: 3447003, description: `${role} is not whitelisted.` });
				}

				const index = roleWhitelist.indexOf(role.id);
				roleWhitelist.splice(index, 1);

				if (roleWhitelist.length === 0) {
					this.client.provider.remove(msg.guild.id, 'roleWhitelist');
				} else {
					this.client.provider.set(msg.guild.id, 'roleWhitelist', roleWhitelist);
				}

				return msg.embed({ color: 3447003, description: `${role} has been removed from the whitelist.` });
			}
		} catch (err) {
			winston.error(err);
		}
	}
};
