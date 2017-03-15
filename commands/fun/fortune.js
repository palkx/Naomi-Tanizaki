const { Command } = require('discord.js-commando');
const request = require('request-promise');
const { stripIndents } = require('common-tags');

const version = require('../../package').version;

module.exports = class FortuneCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fortune',
			group: 'fun',
			memberName: 'fortune',
			description: 'Get a fortune.',
			format: '[category]',
			details: stripIndents`Get a fortune. The following categories are avaliable:
				all, computers, cookie, definitions, miscellaneous, people, platitudes, politics, science, and wisdom.`,
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'category',
					prompt: 'what category would you like to get a fortune on?\n',
					type: 'string',
					default: ''
				}
			]
		});
	}

	async run(msg, args) {
		const regex = /^(all|computers|cookie|definitions|miscellaneous|people|platitudes|politics|science|wisdom)$/i;
		const category = regex.test(args.category)
		? args.category.toLowerCase()
		: 'wisdom';

		const response = await request({
			uri: `http://www.yerkee.com/api/fortune/${category}`,
			headers: { 'User-Agent': `Hamakaze v${version} (https://github.com/WeebDev/Hamakaze/)` },
			json: true
		});

		return msg.embed({
			color: 3447003,
			description: response.fortune
		});
	}
};
