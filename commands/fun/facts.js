const { Command } = require('discord.js-commando');
const request = require('request-promise');
const { stripIndents } = require('common-tags');
const _sdata = require('../../assets/_data/static_data.json');
const version = require('../../package').version;

const types = ['math', 'date', 'year', 'trivia'];

module.exports = class FactsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'facts',
			aliases: ['fact'],
			group: 'fun',
			memberName: 'facts',
			description: '`AL: low` Get facts about a number, date, or cats.',
			format: '[rng <math|date|year|trivia> | number <num> | math <num> | date <MM/DD> | year <YYYY> | cat(s)]',
			details: stripIndents`Get facts about cats, a number, date, year, or math facts on a number.
				Formats: \`rng trivia\` \`number 42\` \`math 42\` \`date 7/17\` \`year 1777\``,
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'category',
					prompt: 'what category would you like to get a fact on?\n',
					type: 'string'
				},
				{
					key: 'subcategory',
					prompt: 'what subcategory would you like to get a fact on?\n',
					type: 'string',
					default: ''
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.low;
	}

	async run(msg, { category, subcategory }) { // eslint-disable-line consistent-return, require-await
		if (category === 'random' || category === 'rng') return this.getRandom(msg, subcategory);
		else if (category === 'number') return this.getFact(msg, subcategory, 'trivia');
		else if (category === 'math') return this.getFact(msg, subcategory, 'math');
		else if (category === 'date') return this.getFact(msg, subcategory, 'date');
		else if (category === 'year') return this.getFact(msg, subcategory, 'year');
		else if (category === 'cat' || category === 'cats') return this.getCat(msg);
	}

	async getRandom(msg, subcategory) {
		const type = subcategory
			? types.includes(subcategory)
			? subcategory
			: types[Math.floor(Math.random() * types.length)]
			: types[Math.floor(Math.random() * types.length)];
		const response = await request({
			uri: `http://numbersapi.com/random/${type}`,
			headers: { 'User-Agent': `Naomi Tanizaki v${version} (https://github.com/iSm1le/Naomi-Tanizaki/)` },
			json: true
		});
		return msg.embed({ color: _sdata.colors.blue, description: response });
	}

	async getFact(msg, number, type) {
		if (number) {
			const response = await request({
				uri: `http://numbersapi.com/${number}/${type}`,
				headers: { 'User-Agent': `Naomi Tanizaki v${version} (https://github.com/iSm1le/Naomi-Tanizaki/)` },
				json: true
			});
			return msg.embed({ color: _sdata.colors.blue, description: response });
		}
		return msg.embed({
			color: _sdata.colors.blue,
			description: `you need to supply a number. Maybe you want \`facts random ${type}\`?`
		});
	}

	async getCat(msg) {
		const response = await request({
			uri: 'http://catfacts-api.appspot.com/api/facts',
			headers: { 'User-Agent': `Naomi Tanizaki v${version} (https://github.com/iSm1le/Naomi-Tanizaki/)` },
			json: true
		});
		return msg.embed({
			color: _sdata.colors.blue,
			description: stripIndents`🐱 **${msg.author}, did you know:**
				${response.facts[0]}`
		});
	}
};
