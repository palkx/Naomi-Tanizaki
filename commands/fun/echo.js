const { Command } = require('discord.js-commando');

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

	async run(msg, args) {
		const { message } = args;
		msg.delete();

		return msg.say(message);
	}
};
