const { Command } = require('discord.js-commando');
const _sdata = require('../../assets/_data/static_data.json');
const Tag = require('../../models/Tag');

module.exports = class TagCommand extends Command {
	constructor (client) {
		super(client, {
			name: 'tag',
			group: 'tags',
			memberName: 'tag',
			description: '`AL: low` Displays a tag.',
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'name',
					label: 'tagname',
					prompt: 'what tag would you like to see?\n',
					type: 'string',
					parse: str => str.toLowerCase()
				}
			]
		});
	}

	hasPermission (msg) {
		return this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.low;
	}

	async run (msg, { name }) {
		const tag = await Tag.findOne({ where: { name, guildID: msg.guild.id } });
		if (!tag) return null;
		tag.increment('uses');
		return msg.embed({ color: _sdata.colors.blue, description: tag.content });
	}
};
