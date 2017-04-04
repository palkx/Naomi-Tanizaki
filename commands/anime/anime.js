const common_tags_1 = require("common-tags");
const discord_js_commando_1 = require("discord.js-commando");
const moment = require("moment");
const nani = require('nani');

const { aniListID, aniListSecret } = require('../../settings.json');

var seasons;

(function (seasons) {
	seasons[seasons["Winter"] = 0] = "Winter";
	seasons[seasons["Spring"] = 1] = "Spring";
	seasons[seasons["Summer"] = 2] = "Summer";
	seasons[seasons["Fall"] = 3] = "Fall";
})(seasons || (seasons = {}));

class AnimeCommand extends discord_js_commando_1.Command {
	constructor(client) {
		super(client, {
			name: 'anime',
			aliases: ['animu'],
			group: 'anime',
			memberName: 'anime',
			description: 'Get info on an anime.',
			throttling: {
				usages: 2,
				duration: 3
			},
			args: [
				{
					key: 'anime',
					prompt: 'what anime would you like to look up?\n',
					type: 'string'
				}
			]
		});
		nani.init(aniListID, aniListSecret);
	}

	async run(msg, args) {
		const { anime } = args;
		let data = await nani.get(`anime/search/${anime}`);
		if (!Array.isArray(data)) {
			return msg.reply(data.error.messages[0]);
		}
		data = data.length === 1
			? data[0]
			: data.find((en) => en.title_english.toLowerCase() === anime.toLowerCase()
				|| en.title_romaji.toLowerCase() === anime.toLowerCase())
				|| data[0];
		const title = data.title_english !== '' && data.title_romaji !== data.title_english
			? `${data.title_english} / ${data.title_romaji} / ${data.title_japanese}`
			: `${data.title_romaji} / ${data.title_japanese}`;
		const synopsis = data.description
			? data.description.replace(/\\n/g, '\n').replace(/<br>|\\r/g, '').substring(0, 1000)
			: 'No description';
		const score = data.average_score / 10;
		return msg.embed({
			color: 3447003,
			author: {
				name: title,
				url: `https://www.anilist.co/anime/${data.id}`
			},
			fields: [
				{
					name: 'Type',
					value: common_tags_1.stripIndents `
						${data.type}
						${data.season !== null
						? this._parseSeason(data.season)
						: '?'}
						${data.source !== null
						? data.source
						: '?'}
					`,
					inline: true
				},
				{
					name: 'Episodes',
					value: data.total_episodes,
					inline: true
				},
				{
					name: 'Status',
					value: data.airing_status.replace(/(\b\w)/gi, (lc) => lc.toUpperCase()),
					inline: true
				},
				{
					name: 'Genre(s)',
					value: data.genres.join(', '),
					inline: true
				},
				{
					name: 'Episode length',
					value: `${data.duration !== null ? data.duration : '?'} mins/ep`,
					inline: true
				},
				{
					name: 'Score',
					value: score.toFixed(2),
					inline: true
				},
				{
					name: 'Description:',
					value: `${synopsis}\n\u200B`,
					inline: false
				}
			],
			thumbnail: { url: data.image_url_med },
			footer: {
				text: `
					Started: ${moment.utc(data.start_date)
					.format('DD/MM/YYYY')} | Finished: ${data.end_date !== null
					? moment.utc(data.end_date)
						.format('DD/MM/YYYY')
					: '?'}
				`
			}
		});
	}

	_parseSeason(season) {
		return season < 350
			? `${seasons[season % 10]} 20${Math.floor(season / 10)}`
			: `${seasons[season % 10]} 19${Math.floor(season / 10)}`;
	}
}
exports.default = AnimeCommand;
