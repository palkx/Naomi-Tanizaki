const { Command } = require('discord.js-commando');
const _sdata = require('../../assets/_data/static_data.json');
module.exports = class EchoCommand extends Command {
	constructor (client) {
		super(client, {
			name: 'echo',
			group: 'fun',
			memberName: 'echo',
			description: '`AL: low` Repeats your message.',
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

	hasPermission (msg) {
		return this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.low;
	}

	async run (msg, { message }) { // eslint-disable-line require-await
		msg.delete();

		return msg.embed({ color: _sdata.colors.dark_grey, description: message });
	}
};
