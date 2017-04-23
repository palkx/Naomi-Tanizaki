const { Command } = require('discord.js-commando');
const colors = require('../../assets/_data/colors.json');
const { permittedGroup } = require('../../assets/_data/settings.json');
const Starboard = require('../../structures/stars/Starboard');

module.exports = class DeleteStarCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'delete-star',
			aliases: ['star-delete', 'star-del', 'del-star'],
			group: 'stars',
			memberName: 'delete',
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

	hasPermission(msg) {
		return msg.member.roles.exists('name', permittedGroup);
	}

	async run(msg, args) {
		const { message } = args;
		const starboard = msg.guild.channels.find('name', 'starboard');
		if (!starboard) {
			return msg.embed({
				color: colors.blue,
				description: `${msg.author}, you can't delete stars if you don't even have a starboard.`
			});
		}
		const isStarred = await Starboard.isStarred(message.id);
		if (!isStarred) {
			return msg.embed({ color: colors.red, description: `${msg.author}, that message is not on the #starboard.` });
		}
		await Starboard.removeStar(message, starboard);
		return msg.embed({
			color: colors.green,
			description: `${msg.author}, successfully delete the message from the starboard`
		});
	}
};
