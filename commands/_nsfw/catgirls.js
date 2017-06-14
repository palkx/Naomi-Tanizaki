const { Command } = require('discord.js-commando');
const request = require('request-promise');
const { PERMITTED_GROUP } = require('../../assets/_data/settings.json');
const _sdata = require('../../assets/_data/static_data.json');
const { version } = require('../../package.json');

module.exports = class CatgirlCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'catgirl',
			aliases: ['catgirls', 'neko', 'nekos', 'nya', 'nyaa'],
			group: 'nsfw',
			memberName: 'catgirl',
			description: '`AL: low` Posts a random catgirl.',
			details: 'Posts a random catgirl. You can add `-nsfw`. Usable only in nsfw channels.',
			throttling: {
				usages: 2,
				duration: 3
			},
			args: [
				{
					key: 'nsfw',
					prompt: 'would you like to see NSFW pictures?\n',
					type: 'string',
					default: ''
				}
			]
		});
	}

	hasPermission(msg) {
		if (msg.channel.type === 'dm') return true;
		return (this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.low
			&& msg.channel.name.toLowerCase().indexOf('nsfw') > -1)
			|| msg.member.roles.exists('name', PERMITTED_GROUP);
	}

	async run(msg, { nsfw }) {
		const response = await request({
			uri: `http://catgirls.brussell98.tk/api${nsfw === '-nsfw' ? '/nsfw' : ''}/random`,
			headers: { 'User-Agent': `Naomi Tanizaki v${version} (https://github.com/iSm1le/Naomi-Tanizaki/)` },
			json: true
		});
		return msg.embed({
			color: _sdata.colors.green,
			author: {
				name: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
				icon_url: msg.author.displayAvatarURL // eslint-disable-line
			},
			image: { url: response.url }
		});
	}
};
