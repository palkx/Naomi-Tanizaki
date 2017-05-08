const { Command } = require('discord.js-commando');
const _sdata = require('../../assets/_data/static_data.json');
const { PERMITTED_GROUP } = process.env;
const { stripIndents } = require('common-tags');
const Currency = require('../../structures/currency/Currency');

module.exports = class LockAllCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lock-all',
			group: 'economy',
			memberName: 'lock-all',
			description: `\`AL: owner, perm_group\` Disable xp and ${Currency.textSingular} earning on all channels.`,
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			}
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author)
			|| msg.member.roles.exists('name', PERMITTED_GROUP);
	}

	run(msg) {
		const channels = msg.guild.channels.filter(channel => channel.type === 'text');
		const channelLocks = this.client.provider.get(msg.guild.id, 'locks', []);
		for (const channel of channels.values()) {
			if (channelLocks.includes(channel.id)) continue;

			channelLocks.push(channel.id);
		}

		this.client.provider.set(msg.guild.id, 'locks', channelLocks);
		return msg.embed({
			color: _sdata.colors.green,
			description: stripIndents`
			${msg.author}, all channels on this server have been locked.
			You can no longer earn xp or ${Currency.textPlural} anywhere.
		`
		});
	}
};
