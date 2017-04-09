const { Command } = require('discord.js-commando');
const { version } = require('../../settings.json');
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
		return this.client.provider.get(msg.author.id, 'userLevel', [])[0] >= 1
		|| msg.member.roles.exists('name', 'Server Staff')
		|| msg.member.hasPermission('ADMINISTRATOR');
	}

	async run(msg, args) {
		const { tags } = args;
		const page = tags === '' ? Math.floor((Math.random() * 7500) + 1) : 1;
		const response = await request({
			uri: `https://yande.re/post.json?tags=${tags}&page=${page}`,
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
				url: response[_id].file_url !== undefined ? response[_id].file_url : response[_id].sample_url
			},
			color: 0x3498DB,
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
