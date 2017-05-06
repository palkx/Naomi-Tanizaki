const { Command } = require('discord.js-commando');
const colors = require('../../assets/_data/colors.json');
const Starboard = require('../../structures/stars/Starboard');

module.exports = class StarCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'star',
			group: 'stars',
			memberName: 'star',
			description: 'Add a message to the #starboard!',
			guildOnly: true,

			args: [
				{
					key: 'message',
					prompt: 'What message would you like to star?',
					type: 'message'
				}
			]
		});
	}

	async run(msg, { message }) {
		const starboard = msg.guild.channels.find('name', 'starboard');
		if (!starboard) {
			return msg.embed({
				color: colors.red,
				description: `${msg.author}, you can't star things without a #starboard...`
			});
		}
		const isAuthor = await Starboard.isAuthor(message.id, msg.author.id);
		if (isAuthor || message.author.id === msg.author.id) {
			return msg.embed({ color: colors.red, description: `${msg.author}, you can't star your own messages.` });
		}
		const hasStarred = await Starboard.hasStarred(message.id, msg.author.id);
		if (hasStarred) {
			return msg.embed({ color: colors.red, description: `${msg.author}, you've already starred this message.` });
		}
		const isStarred = await Starboard.isStarred(message.id);
		if (isStarred) return Starboard.addStar(message, starboard, msg.author.id);
		Starboard.createStar(message, starboard, msg.author.id);
		return null;
	}
};
