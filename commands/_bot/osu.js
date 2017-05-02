const { Command } = require('discord.js-commando');
const { version } = require('../../package.json');
const { OSU_API_KEY } = process.env;
const colors = require('../../assets/_data/colors.json');
const request = require('request-promise');

module.exports = class OsuCommand extends Command {
	constructor(Client) {
		super(Client, {
			name: 'osu',
			aliases: ['osuuser', 'osudata', 'osuinfo'],
			group: 'bot',
			memberName: 'osu',
			description: 'Searches Osu user data.',
			throttling: {
				usages: 3,
				duration: 30
			},

			args: [{
				key: 'username',
				prompt: 'What osu username would you like to search for?',
				type: 'string'
			}]

		});
	}

	async run(msg, { username }) {
		if (!OSU_API_KEY) {
			return msg.embed({
				color: colors.red,
				description: `I don't have osu key`
			});
		}
		const response = await request({
			uri: `https://osu.ppy.sh/api/get_user?k=${OSU_API_KEY}&u=${username}`,
			headers: { 'User-Agent': `Naomi Tanizaki v${version} (https://github.com/iSm1le/Naomi-Tanizaki/)` },
			json: true
		});
		if (response.length === 0) {
			return msg.embed({
				color: colors.red,
				description: 'your request returned no results.'
			});
		}
		const userBest = await request({
			uri: `https://osu.ppy.sh/api/get_user_best?k=${OSU_API_KEY}&u=${username}&limit=1`,
			headers: { 'User-Agent': `Naomi Tanizaki v${version} (https://github.com/iSm1le/Naomi-Tanizaki/)` },
			json: true
		});
		const _userBest = await request({
			uri: `https://osu.ppy.sh/api/get_beatmaps?k=${OSU_API_KEY}&limit=1&b=${userBest[0].beatmap_id}`,
			headers: { 'User-Agent': `Naomi Tanizaki v${version} (https://github.com/iSm1le/Naomi-Tanizaki/)` },
			json: true
		});
		return msg.embed({
			author: {
				icon_url: 'http://vignette3.wikia.nocookie.net/osugame/images/c/c9/Logo.png/revision/latest?cb=20151219073209', // eslint-disable-line
				name: 'osu!',
				url: `https://osu.ppy.sh/u/${response[0].user_id}`
			},
			color: colors.green,
			fields: [
				{
					name: '**Username**',
					value: response[0].username,
					inline: true
				},
				{
					name: '**ID**',
					value: response[0].user_id,
					inline: true
				},
				{
					name: '**Level**',
					value: response[0].level,
					inline: true
				},
				{
					name: '**Accuracy**',
					value: `${parseFloat(Math.round(response[0].accuracy * 100) / 100).toFixed(2)}%`,
					inline: true
				},
				{
					name: '**Global rank**',
					value: `#${response[0].pp_rank}`,
					inline: true
				},
				{
					name: '**Play Count**',
					value: response[0].playcount,
					inline: true
				},
				{
					name: '**A/S/SS**',
					value: `${response[0].count_rank_a}/${response[0].count_rank_s}/${response[0].count_rank_ss}`,
					inline: true
				},
				{
					name: '**PP**',
					value: `${parseFloat(Math.round(response[0].pp_raw * 100) / 100).toFixed(2)}`,
					inline: true
				},
				{
					name: '**Best play**',
					value: `:flag_${response[0].country.toLowerCase()}: ${response[0].country} ${_userBest[0].title} \`${userBest[0].pp}\``, // eslint-disable-line
					inline: true
				}
			],
			thumbnail: { url: `https://a.ppy.sh/${response[0].user_id}` || undefined }
		});
	}
};
