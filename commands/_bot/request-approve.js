const { Command } = require('discord.js-commando');
const _sdata = require('../../assets/_data/static_data.json');
const Request = require('../../models/Request');
const { REQUEST_CHANNEL } = require('../../assets/_data/settings.json');

module.exports = class ApproveRequestCommand extends Command {
	constructor (client) {
		super(client, {
			name: 'request-approve',
			aliases: ['req-a'],
			group: 'bot',
			memberName: 'request-approve',
			description: '`AL: full` Approve a requested feature.',
			guarded: true,

			args: [
				{
					key: 'requestID',
					prompt: 'which feature request do you want to approve?\n',
					type: 'integer'
				}
			]
		});
	}

	hasPermission (msg) {
		return this.client.isOwner(msg.author)
			|| this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.full;
	}

	async run (msg, { requestID }) {
		if (msg.channel.id !== REQUEST_CHANNEL) {
			return msg.embed({
				color: _sdata.colors.red,
				description: `${msg.author}, this command can only be used in the requests channel.`
			});
		}

		const request = await Request.findById(requestID);
		if (!request) {
			return msg.embed({
				color: _sdata.colors.dark_green,
				description: `${msg.author}, you provided an invalid request id.`
			});
		}
		await request.update({
			processed: true,
			processedBy: msg.author.id,
			approved: true
		});

		await this.client.users.get(request.requester).send({
			embed: {
				color: _sdata.colors.green,
				author: {
					name: 'Request approved',
					icon_url: msg.author.displayAvatarURL // eslint-disable-line camelcase
				},
				description: 'Your request has been reviewed and approved!',
				fields: [
					{
						name: 'Your request:',
						value: request.request.length <= 1024 ? request.request : `${request.request.substr(0, 1021)}...`
					}
				]
			}
		});

		return msg.embed({
			color: _sdata.colors.green,
			description: `${msg.author}, successfully approved request #${request.id}!`
		})
			.then(async () => {
				const messages = await msg.channel.fetchMessages({ after: msg.id });
				const requestMessage = await msg.channel.fetchMessage(request.requestMessage);
				messages.deleteAll();
				msg.delete();
				requestMessage.delete();
			});
	}
};
