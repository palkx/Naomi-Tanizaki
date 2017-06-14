const { Command } = require('discord.js-commando');
const _sdata = require('../../assets/_data/static_data.json');
const Issue = require('../../models/Issue');
const { ISSUE_CHANNEL } = require('../../assets/_data/settings.json');

module.exports = class InvalidIssueCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'issue-reject',
			aliases: ['iss-r'],
			group: 'bot',
			memberName: 'issue-reject',
			description: '`AL: full` Mark an issue as invalid/rejected.',
			guarded: true,

			args: [
				{
					key: 'issueID',
					prompt: 'which issue would you like to invalidate?\n',
					type: 'integer'
				},
				{
					key: 'reason',
					prompt: 'why do you want to mark the issue as invalid?\n',
					type: 'string'
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author)
			|| this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.full;
	}

	async run(msg, { issueID, reason }) {
		if (msg.channel.id !== ISSUE_CHANNEL) {
			return msg.embed({
				color: _sdata.colors.dark_green,
				description: `${msg.author}, this command can only be used in the issues channel.`
			});
		}

		const issue = await Issue.findById(issueID);
		if (!issue) {
			return msg.embed({
				color: _sdata.colors.dark_green,
				description: `${msg.author}, you provided an invalid issue id.`
			});
		}
		await issue.save({
			processed: true,
			processedBy: msg.author.id,
			fixed: false,
			reason
		});

		await this.client.users.get(issue.discoveredBy).send({
			embed: {
				color: _sdata.colors.red,
				author: {
					name: 'Issue invalidated',
					icon_url: msg.author.displayAvatarURL // eslint-disable-line camelcase
				},
				description: reason,
				fields: [
					{
						name: 'Your issue:',
						value: issue.issue.length <= 1024 ? issue.issue : `${issue.issue.substr(0, 1021)}...`
					}
				]
			}
		});

		return msg.embed({
			color: _sdata.colors.green,
			description: `${msg.author}, successfully rejected issue #${issue.id}!`
		})
			.then(async () => {
				const messages = await msg.channel.fetchMessages({ after: msg.id });
				const issueMessage = await msg.channel.fetchMessage(issue.issueMessage);
				messages.deleteAll();
				msg.delete();
				issueMessage.delete();
			});
	}
};
