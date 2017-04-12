const { Command } = require('discord.js-commando');
const { colorError, colorOk, permittedGroup } = require('../../settings.json');
const { stripIndents } = require('common-tags');

module.exports = class RoleWhitelistCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'role-admin',
			aliases: ['ra'],
			group: 'util',
			memberName: 'role-admin',
			description: 'Add/remove user to/from role admin. If null - standard privileges system works.',
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 5
			},

			args: [
				{
					key: 'job',
					prompt: 'add or remove admin?\n',
					type: 'string',
					validate: job => {
						if (job.toLowerCase() !== 'add' && job.toLowerCase() !== 'remove') {
							return `Job name must be add or remove`;
						}
						return true;
					}
				},

				{
					key: 'aMember',
					prompt: 'user, which have admin privileges on role\n',
					type: 'member'
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
		const { aMember } = args;

		const roleWhitelist = this.client.provider.get(msg.guild.id, 'roleWhitelist', []);
		if (!roleWhitelist.includes(role.id)) {
			return msg.embed({ color: colorError, description: `Whitelist ${role} first.` });
		}

		const roleAdminList = this.client.provider.get(msg.guild.id, `${role.id}_admins`, []);
		if (roleAdminList.length !== 0) {
			if (!roleAdminList.includes(msg.member.id) && !this.client.isOwner(msg.member)) {
				return msg.embed({
					color: colorError,
					description: stripIndents`
					${msg.member}, you cant add admin to ${role}.This role already have 
					an a admin (${msg.guild.members.find('id', roleAdminList[0])}), ask him to add you.
					`
				});
			}
		}

		if (job) {
			if (roleAdminList.includes(aMember.id)) {
				return msg.embed({ color: colorError, description: `${aMember} you already admin of ${role}.` });
			}

			roleAdminList.push(aMember.id);
			this.client.provider.set(msg.guild.id, `${role.id}_admins`, roleAdminList);

			return msg.embed({ color: colorOk, description: `${aMember} has been added to the ${role} admins.` });
		} else {
			if (!roleAdminList.includes(aMember.id)) {
				return msg.embed({ color: colorError, description: `${aMember} is not an a admin on ${role}.` });
			}

			const index = roleAdminList.indexOf(aMember.id);
			roleAdminList.splice(index, 1);

			if (roleAdminList.length === 0) {
				this.client.provider.remove(msg.guild.id, `${role.id}_admins`);
			} else {
				this.client.provider.set(msg.guild.id, `${role.id}_admins`, roleAdminList);
			}

			return msg.embed({ color: colorOk, description: `${aMember} has been removed from the ${role} admins.` });
		}
	}
};
