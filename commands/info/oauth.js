const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const _sdata = require('../../assets/_data/static_data.json');
const { OAUTH_LINK } = require('../../assets/_data/settings.json');

module.exports = class AboutCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'oauth',
			aliases: ['invite'],
			group: 'info',
			memberName: 'oauth',
			description: '`AL: low` The link to add Naomi to a server.',
			throttling: {
				usages: 2,
				duration: 3
			}
		});
	}

	hasPermission(msg) {
		return this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.low;
	}

	async run(msg) { // eslint-disable-line require-await
		if (!OAUTH_LINK) {
			return msg.embed({
				color: _sdata.colors.red,
				description: `I don't have an invite link for you at the moment. Sorry, ${msg.author}.`
			});
		}
		return msg.embed({
			color: _sdata.colors.blue,
			description: stripIndents`Use this to add me to a server, ${msg.author}:
			${OAUTH_LINK}
			Make sure you are logged in!`
		});
	}
};
