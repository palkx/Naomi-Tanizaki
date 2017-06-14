const { Command } = require('discord.js-commando');
const { version } = require('../../package.json');
const { PERMITTED_GROUP } = require('../../assets/_data/settings.json');
const _sdata = require('../../assets/_data/static_data.json');
const request = require('request-promise');

module.exports = class DanbooruCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'danbooru',
			aliases: ['dboo'],
			group: 'nsfw',
			memberName: 'danbooru',
			description: '`AL: low` Random picture from danbooru.donmai.us. Usable only in nsfw channels.',
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
		if (msg.channel.type === 'dm') return true;
		return (this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.low
			&& msg.channel.name.toLowerCase().indexOf('nsfw') > -1)
			|| msg.member.roles.exists('name', PERMITTED_GROUP);
	}

	async run(msg, { tags }) {
		const _tags = tags.replace(' ', '+');
		const _random = _tags === '';
		const response = await request({
			uri: `https://danbooru.donmai.us/posts.json?random=${_random}&tags=${_tags}`,
			headers: { 'User-Agent': `Naomi Tanizaki v${version} (https://github.com/iSm1le/Naomi-Tanizaki/)` },
			json: true
		});
		if (response.length === 0) {
			return msg.embed({
				color: _sdata.colors.red,
				description: 'your request returned no results.'
			});
		}
		const _id = Math.floor((Math.random() * response.length) + 1);
		return msg.embed({
			author: {
				icon_url: msg.author.displayAvatarURL, // eslint-disable-line camelcase
				name: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
				url: `https://danbooru.donmai.us/posts/${response[_id].id}`
			},
			color: _sdata.colors.green,
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
