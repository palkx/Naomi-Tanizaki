const { Command } = require('discord.js-commando');
const { colorError, colorOk, permittedGroup } = require('../../settings.json');

module.exports = class RoleWhitelistCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'role-whitelist',
			aliases: ['rw'],
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
					prompt: 'add or remove role?\n',
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
		return this.client.provider.get(msg.author.id, 'userLevel') >= 3
		|| msg.member.roles.exists('name', permittedGroup);
	}

	async run(msg, args) {  // eslint-disable-line consistent-return
		let role = msg.guild.roles.find('name', args.role);
		if (!role) { return msg.embed({ color: colorError, description: `${args.role} group is not exist on server` }); }
		const job = args.job.toLowerCase() === 'add';

		const roleWhitelist = this.client.provider.get(msg.guild.id, 'roleWhitelist', []);
		if (job) {
			if (roleWhitelist.includes(role.id)) {
				return msg.embed({ color: colorError, description: `${role} is already whitelisted.` });
			}

			roleWhitelist.push(role.id);
			this.client.provider.set(msg.guild.id, 'roleWhitelist', roleWhitelist);

			return msg.embed({ color: colorOk, description: `${role} has been added to the whitelist.` });
		} else {
			if (!roleWhitelist.includes(role.id)) {
				return msg.embed({ color: colorError, description: `${role} is not whitelisted.` });
			}

			const index = roleWhitelist.indexOf(role.id);
			roleWhitelist.splice(index, 1);

			if (roleWhitelist.length === 0) {
				this.client.provider.remove(msg.guild.id, 'roleWhitelist');
			} else {
				this.client.provider.set(msg.guild.id, 'roleWhitelist', roleWhitelist);
			}

			return msg.embed({ color: colorOk, description: `${role} has been removed from the whitelist.` });
		}
	}
};
