const { Command } = require('discord.js-commando');
const { version } = require('../../settings.json');
const request = require('request-promise');

module.exports = class DanbooruCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'danbooru',
			aliases: ['dboo'],
			group: 'nsfw',
			memberName: 'danbooru',
			description: 'Random picture from danbooru.donmai.us',
			throttling: {
				usages: 1,
				duration: 15
			},

			args: [{
				key: 'tags',
				default: '',
				prompt: 'Set of tags',
				type: 'string'
			}]
		});
	}

	hasPermission(msg) {
		return this.client.provider.get(msg.author.id, 'userLevel', [])[0] >= 1
		|| msg.member.roles.exists('name', 'Server Staff')
		|| msg.member.hasPermission('ADMINISTRATOR');
	}

	async run(msg, args) {
		const { tags } = args;
		const _random = tags === '';
		const response = await request({
			uri: `https://danbooru.donmai.us/posts.json?random=${_random}&tags=${tags}`,
			headers: { 'User-Agent': `Naomi Tanizaki v${version} (https://github.com/iSm1le/Naomi-Tanizaki/)` },
			json: true
		});
		if (response.length === 0) {
			return msg.embed({
				color: 0x3498DB,
				description: 'your request returned no results.'
			});
		}
		const _id = Math.floor((Math.random() * response.length) + 1);
		return msg.embed({
			author: {
				icon_url: msg.author.displayAvatarURL, // eslint-disable-line camelcase
				name: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
				url: response[_id].large_file_url !== undefined ? `https://danbooru.donmai.us${response[_id].large_file_url}` : `https://danbooru.donmai.us${response[_id].preview_file_url}` // eslint-disable-line
			},
			color: 0x3498DB,
			fields: [
				{
					name: 'ID',
					value: response[_id].id,
					inline: true
				}
			],
			image: { url: `https://danbooru.donmai.us${response[_id].preview_file_url}` || undefined },
			footer: { text: `Tags: ${response[_id].tag_string}` }
		});
	}
};
