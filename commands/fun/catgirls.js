const { Command } = require('discord.js-commando');
const request = require('request-promise');
const colors = require('../../assets/_data/colors.json');
const { version } = require('../../package.json');

module.exports = class CatgirlCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'catgirl',
			aliases: ['catgirls', 'neko', 'nekos', 'nya', 'nyaa'],
			group: 'anime',
			memberName: 'catgirl',
			description: 'Posts a random catgirl.',
			details: 'Posts a random catgirl. Add `-nsfw` to the command to get nsfw pictures.',
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

	async run(msg, args) {
		const { nsfw } = args;
		const response = await request({
			uri: `http://catgirls.brussell98.tk/api${nsfw === '-nsfw' ? '/nsfw' : ''}/random`,
			headers: { 'User-Agent': `Naomi Tanizaki v${version} (https://github.com/iSm1le/Naomi-Tanizaki/)` },
			json: true
		});
		return msg.embed({
			color: colors.green,
			author: {
				name: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
				icon_url: msg.author.displayAvatarURL // eslint-disable-line
			},
			image: { url: response.url }
		});
	}
};
