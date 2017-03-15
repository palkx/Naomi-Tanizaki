const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');

const { oAuthLink } = require('../../settings');

module.exports = class AboutCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'oauth',
			aliases: ['invite'],
			group: 'info',
			memberName: 'oauth',
			description: 'The link to add Hamakaze to a server.',
			throttling: {
				usages: 2,
				duration: 3
			}
		});
	}

	async run(msg) {
		if (!oAuthLink) {
			return msg.say(`I don't have an invite link for you at the moment. Sorry, ${msg.author}.`);
		}

		return msg.say(stripIndents`Use this to add me to a server, ${msg.author}:
			${oAuthLink}
			Make sure you are logged in!
		`);
	}
};
