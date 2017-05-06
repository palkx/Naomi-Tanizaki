const { Command } = require('discord.js-commando');
const colors = require('../../assets/_data/colors.json');
module.exports = class EchoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'echo',
			group: 'fun',
			memberName: 'echo',
			description: 'Repeats your message.',
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'message',
					prompt: 'what would you like me to say?\n',
					type: 'string',
					default: 'uhhhm',
					max: 1800
				}
			]
		});
	}

	async run(msg, { message }) { // eslint-disable-line require-await
		msg.delete();

		return msg.embed({ color: colors.dark_grey, description: message });
	}
};
