const { Command } = require('discord.js-commando');
const colors = require('../../assets/_data/colors.json');
const Request = require('../../models/Request');

module.exports = class RequestCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'request-reset',
			group: 'bot',
			memberName: 'request-reset',
			description: 'Reset the requests data table.',

			args: [
				{
					key: 'confirmation',
					prompt: 'are you sure you want to reset the request data table?\n',
					type: 'string',
					validate: confirmation => {
						if (!/^(?:yes|y|-y)$/g.test(confirmation)) {
							return `
								please confirm the reset of the data table with either \`yes\`, \`y\`, or \`-y\`
							`;
						}
						return true;
					}
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

	run(msg) {
		Request.sync({ force: true });
		return msg.embed({ color: colors.green, description: `${msg.author}, the request data table has been reset.` });
	}
};
