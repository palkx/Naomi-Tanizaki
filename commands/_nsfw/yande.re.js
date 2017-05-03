const { Command } = require('discord.js-commando');
const { version } = require('../../package.json');
const { PERMITTED_GROUP } = require('../../assets/_data/settings.json');
const colors = require('../../assets/_data/colors.json');
const request = require('request-promise');

module.exports = class YandereCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'yandere',
			aliases: ['yare'],
			group: 'nsfw',
			memberName: 'yandere',
			description: 'Random picture from yande.re',
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
		return (this.client.provider.get(msg.author.id, 'userLevel') >= 1
			&& msg.channel.name.toLowerCase().indexOf('nsfw') > -1)
				|| msg.member.roles.exists('name', PERMITTED_GROUP);
	}

	async run(msg, { tags }) {
		const _tags = tags.replace(' ', '+');
		const page = _tags === '' ? Math.floor((Math.random() * 7500) + 1) : 1;
		const response = await request({
			uri: `https://yande.re/post.json?tags=${_tags}&page=${page}`,
			headers: { 'User-Agent': `Naomi Tanizaki v${version} (https://github.com/iSm1le/Naomi-Tanizaki/)` },
			json: true
		});
		if (response.length === 0) {
			return msg.embed({
				color: colors.red,
				description: 'your request returned no results.'
			});
		}
		const _id = Math.floor((Math.random() * response.length) + 1);
		return msg.embed({
			author: {
				icon_url: msg.author.displayAvatarURL, // eslint-disable-line camelcase
				name: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
				url: response[_id].file_url !== undefined ? response[_id].file_url : response[_id].sample_url
			},
			color: colors.green,
			fields: [
				{
					name: 'ID',
					value: response[_id].id,
					inline: true
				}
			],
			image: { url: response[_id].sample_url || undefined },
			footer: { text: `Tags: ${response[_id].tags}` }
		});
	}
};
