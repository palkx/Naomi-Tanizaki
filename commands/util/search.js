const { Command } = require('discord.js-commando');
const cheerio = require('cheerio');
const snekfetch = require('snekfetch');
const querystring = require('querystring');
const _sdata = require('../../assets/_data/static_data.json');

const { GOOGLE_CUSTOM_SEARCH, GOOGLE_CUSTOM_SEARCH_CX } = require('../../assets/_data/settings.json');

module.exports = class SearchCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'search',
			aliases: ['s'],
			group: 'util',
			memberName: 'search',
			description: '`AL: low` Searches google.',
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'search',
					prompt: 'what would you like to search the internet for?\n',
					type: 'string'
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.low;
	}

	async run(msg, args) {
		const { search } = args;
		if (!GOOGLE_CUSTOM_SEARCH) {
			return msg.embed({
				color: _sdata.colors.red,
				description: 'Owner has not set the Google API Key. Go yell at him.'
			});
		}
		if (!GOOGLE_CUSTOM_SEARCH_CX) {
			return msg.embed({
				color: _sdata.colors.red,
				description: 'Owner has not set the Google API Key. Go yell at him.'
			});
		}

		const queryParams = {
			key: GOOGLE_CUSTOM_SEARCH,
			cx: GOOGLE_CUSTOM_SEARCH_CX,
			safe: 'medium',
			q: encodeURI(search) // eslint-disable-line id-length
		};

		try {
			const res = await snekfetch.get(`https://www.googleapis.com/customsearch/v1?${querystring.stringify(queryParams)}`); // eslint-disable-line max-len
			if (res.body.queries.request[0].totalResults === '0') throw new Error('No results');
			return msg.embed({
				title: res.body.items[0].title,
				color: _sdata.colors.green,
				url: res.body.items[0].link,
				description: res.body.items[0].snippet,
				thumbnail: { url: res.body.items[0].pagemap.cse_image[0].src }
			});
		} catch (error) {
			const res = await snekfetch.get(`https://www.google.com/search?safe=medium&q=${encodeURI(search)}`);
			const $ = cheerio.load(res.text); // eslint-disable-line id-length
			let href = $('.r')
				.first()
				.find('a')
				.first()
				.attr('href');
			const title = $('.r')
				.first()
				.find('a')
				.text();
			const description = $('.st')
				.first()
				.text();
			if (!href) {
				return msg.embed({
					color: _sdata.colors.red,
					description: 'No results'
				});
			}
			href = querystring.parse(href.replace('/url?', ''));
			return msg.embed({
				title,
				color: _sdata.colors.green,
				url: href.q,
				description
			});
		}
	}
};
