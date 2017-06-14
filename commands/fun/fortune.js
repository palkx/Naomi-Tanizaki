const { Command } = require('discord.js-commando');
const request = require('request-promise');
const { stripIndents } = require('common-tags');
const _sdata = require('../../assets/_data/static_data.json');
const version = require('../../package').version;

module.exports = class FortuneCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'fortune',
			group: 'fun',
			memberName: 'fortune',
			description: '`AL: low` Get a fortune.',
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

	hasPermission(msg) {
		return this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.low;
	}

	async run(msg, { category }) {
		const regex = /^(all|computers|cookie|definitions|miscellaneous|people|platitudes|politics|science|wisdom)$/i;
		const _category = regex.test(category)
		? category.toLowerCase()
		: 'wisdom';

		const response = await request({
			uri: `http://www.yerkee.com/api/fortune/${_category}`,
			headers: { 'User-Agent': `Naomi Tanizaki v${version} (https://github.com/iSm1le/Naomi-Tanizaki/)` },
			json: true
		});

		return msg.embed({
			color: _sdata.colors.blue,
			description: response.fortune
		});
	}
};
