const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');

module.exports = class AboutCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'about',
			group: 'misc',
			memberName: 'about',
			description: 'Displays information about the command framework.',
			guildOnly: false,
			throttling: {
				usages: 2,
				duration: 5
			}
		});
	}

	async run(msg) {
		return msg.embed({
			color: 3447003,
			description: stripIndents`
				__**discord.js Commando:**__
				This is the official command framework for discord.js.
				[Framework GitHub](https://github.com/Gawdl3y/discord.js-commando)
				[Naomi Tanizaki bot Github](https://github.com/iSm1le/Naomi-Tanizaki)
				[Documentation (WIP)](https://discord.js.org/#/docs/commando/)
				[Discord.js Documentation](https://discord.js.org/#/docs/main/)
			`
		});
	}
};
