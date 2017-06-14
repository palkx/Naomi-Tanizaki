/* eslint-disable max-len,max-len */
const { Command } = require('discord.js-commando');
const { PERMITTED_GROUP } = process.env;
const _sdata = require('../../assets/_data/static_data.json');
const { oneLine } = require('common-tags');

module.exports = class RoleWhitelistCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'role-admin',
			aliases: ['ra'],
			group: 'util',
			memberName: 'role-admin',
			description: '`AL: high` Add/remove user to/from role admin. If null - standard privileges system works.',
			guildOnly: true,
			guarded: true,
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
						if (['add', 'remove'].includes(job)) {
							return true;
						}
						return `Job name must be **add** or **remove**`;
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
		return this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.high
			|| msg.member.roles.exists('name', PERMITTED_GROUP);
	}

	async run(msg, { job, aMember, role }) { // eslint-disable-line consistent-return, require-await
		let _role = msg.guild.roles.find('name', role);
		if (!_role) { return msg.embed({ color: _sdata.colors.red, description: `${role} group is not exist on server` }); }
		const _job = job.toLowerCase() === 'add';

		const roleWhitelist = this.client.provider.get(msg.guild.id, 'roleWhitelist', []);
		if (!roleWhitelist.includes(_role.id)) {
			return msg.embed({ color: _sdata.colors.red, description: `Whitelist ${_role} first.` });
		}

		const roleAdminList = this.client.provider.get(msg.guild.id, `${_role.id}_admins`, []);
		if (roleAdminList.length !== 0) {
			if (!roleAdminList.includes(msg.member.id) && !this.client.isOwner(msg.member)) {
				return msg.embed({
					color: _sdata.colors.red,
					description: oneLine`
					${msg.member}, you cant add admin to ${_role}.This role already have 
					an a admin (${msg.guild.members.find('id', roleAdminList[0])}), ask him to add you.`
				});
			}
		}

		if (_job) {
			if (roleAdminList.includes(aMember.id)) {
				return msg.embed({ color: _sdata.colors.red, description: `${aMember} you already admin of ${_role}.` });
			}

			roleAdminList.push(aMember.id);
			this.client.provider.set(msg.guild.id, `${_role.id}_admins`, roleAdminList);

			return msg.embed({ color: _sdata.colors.green, description: `${aMember} has been added to the ${_role} admins.` });
		} else {
			if (!roleAdminList.includes(aMember.id)) {
				return msg.embed({ color: _sdata.colors.red, description: `${aMember} is not an a admin on ${_role}.` });
			}

			const index = roleAdminList.indexOf(aMember.id);
			roleAdminList.splice(index, 1);

			if (roleAdminList.length === 0) {
				this.client.provider.remove(msg.guild.id, `${_role.id}_admins`);
			} else {
				this.client.provider.set(msg.guild.id, `${_role.id}_admins`, roleAdminList);
			}

			return msg.embed({ color: _sdata.colors.green, description: `${aMember} has been removed from the ${_role} admins.` });
		}
	}
};
