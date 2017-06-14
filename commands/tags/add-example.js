const { Command } = require('discord.js-commando');
const _sdata = require('../../assets/_data/static_data.json');
const { EXAMPLE_CHANNEL, PERMITTED_GROUP } = require('../../assets/_data/settings.json');
const Tag = require('../../models/Tag');
const Util = require('../../util/Util');

module.exports = class ExampleAddCommand extends Command {
	constructor (client) {
		super(client, {
			name: 'add-example',
			aliases: ['example-add', 'tag-add-example', 'add-example-tag'],
			group: 'tags',
			memberName: 'add-example',
			description: '`AL: owner, high, perm_group` Adds an example.',
			details: `Adds an example and posts it into the #examples channel. (Markdown can be used.)`,
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'name',
					label: 'examplename',
					prompt: 'what would you like to name it?\n',
					type: 'string'
				},
				{
					key: 'content',
					label: 'examplecontent',
					prompt: 'what content would you like to add?\n',
					type: 'string',
					max: 1800
				}
			]
		});
	}

	hasPermission (msg) {
		return this.client.isOwner(msg.author)
			|| msg.member.roles.exists('name', PERMITTED_GROUP)
			|| this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.high;
	}

	async run (msg, args) {
		const name = Util.cleanContent(msg, args.name.toLowerCase());
		const content = Util.cleanContent(msg, args.content);
		const tag = await Tag.findOne({ where: { name, guildID: msg.guild.id } });
		if (tag) {
			return msg.embed({
				color: _sdata.colors.red,
				description: `An example with the name **${name}** already exists, ${msg.author}`
			});
		}

		await Tag.create({
			userID: msg.author.id,
			userName: `${msg.author.tag}`,
			guildID: msg.guild.id,
			guildName: msg.guild.name,
			channelID: msg.channel.id,
			channelName: msg.channel.name,
			name,
			content,
			type: true,
			example: true
		});
		const message = await msg.guild.channels.get(EXAMPLE_CHANNEL).send('', {
			embed: {
				color: _sdata.colors.blue,
				description: content
			}
		});
		Tag.update({ exampleID: message.id }, { where: { name, guildID: msg.guild.id } });
		return msg.embed({
			color: _sdata.colors.green,
			description: `An example with the name **${name}** has been added, ${msg.author}`
		});
	}
};
