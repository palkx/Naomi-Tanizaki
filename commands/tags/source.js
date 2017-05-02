const { Command } = require('discord.js-commando');
const colors = require('../../assets/_data/colors.json');
const Tag = require('../../models/Tag');

module.exports = class TagSourceCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'tag-source',
			aliases: ['source-tag'],
			group: 'tags',
			memberName: 'source',
			description: 'Displays a tags source.',
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'name',
					label: 'tagname',
					prompt: 'what tag source would you like to see?\n',
					type: 'string',
					parse: str => str.toLowerCase()
				}
			]
		});
	}

	async run(msg, { name }) {
		const tag = await Tag.findOne({ where: { name, guildID: msg.guild.id } });
		if (!tag) {
			return msg.embed({
				color: colors.red,
				description: `A tag with the name **${name}** doesn't exist, ${msg.author}`
			});
		}
		return msg.code('md', tag.content);
	}
};
