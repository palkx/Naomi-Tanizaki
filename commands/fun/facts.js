const { Command } = require('discord.js-commando');
const request = require('request-promise');
const { stripIndents } = require('common-tags');

const version = require('../../package').version;

const types = ['math', 'date', 'year', 'trivia'];

module.exports = class FactsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'facts',
			aliases: ['fact'],
			group: 'fun',
			memberName: 'facts',
			description: 'Get facts about a number, date, or cats.',
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

	async run(msg, args) { // eslint-disable-line consistent-return
		const category = args.category;
		const subcategory = args.subcategory;

		if (category === 'random' || category === 'rng') {
			return this.getRandom(msg, subcategory);
		} else if (category === 'number') {
			return this.getFact(msg, subcategory, 'trivia');
		} else if (category === 'math') {
			return this.getFact(msg, subcategory, 'math');
		} else if (category === 'date') {
			return this.getFact(msg, subcategory, 'date');
		} else if (category === 'year') {
			return this.getFact(msg, subcategory, 'year');
		} else if (category === 'cat' || category === 'cats') {
			return this.getCat(msg);
		}
	}

	async getRandom(msg, subcategory) {
		const type = subcategory
		? types.includes(subcategory)
		? subcategory
		: types[Math.floor(Math.random() * types.length)]
		: types[Math.floor(Math.random() * types.length)];
		const response = await request({
			uri: `http://numbersapi.com/random/${type}`,
			headers: { 'User-Agent': `Hamakaze v${version} (https://github.com/WeebDev/Hamakaze/)` },
			json: true
		});

		return msg.say(response);
	}

	async getFact(msg, number, type) {
		if (number) {
			const response = await request({
				uri: `http://numbersapi.com/${number}/${type}`,
				headers: { 'User-Agent': `Hamakaze v${version} (https://github.com/WeebDev/Hamakaze/)` },
				json: true
			});

			return msg.say(response);
		}
		return msg.reply(`you need to supply a number. Maybe you want \`facts random ${type}\`?`);
	}

	async getCat(msg) {
		const response = await request({
			uri: 'http://catfacts-api.appspot.com/api/facts',
			headers: { 'User-Agent': `Hamakaze v${version} (https://github.com/WeebDev/Hamakaze/)` },
			json: true
		});

		return msg.say(stripIndents`🐱 **${msg.author}, did you know:**
				${response.facts[0]}`);
	}
};
