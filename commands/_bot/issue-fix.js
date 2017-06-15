const { Command } = require('discord.js-commando');
const _sdata = require('../../assets/_data/static_data.json');
const Issue = require('../../models/Issue');
const { ISSUE_CHANNEL } = process.env;

module.exports = class FixIssueCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'issue-fix',
			aliases: ['iss-f'],
			group: 'bot',
			memberName: 'fix',
			description: '`AL: full` Fix an issue.',
			guarded: true,

			args: [
				{
					key: 'issueID',
					prompt: 'which issue do you want to fix?\n',
					type: 'integer'
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author)
			|| this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.full;
	}

	async run(msg, { issueID }) {
		if (msg.channel.id !== ISSUE_CHANNEL) {
			return msg.embed({
				color: _sdata.colors.red,
				description: `${msg.author}, this command can only be used in the issues channel.`
			});
		}

		const issue = await Issue.findById(issueID);
		if (!issue) {
			return msg.embed({
				color: _sdata.colors.red,
				description: `${msg.author}, you provided an invalid issue id.`
			});
		}
		await issue.update({
			processed: true,
			processedBy: msg.author.id,
			fixed: true
		});

		await this.client.users.get(issue.discoveredBy).send({
			embed: {
				color: _sdata.colors.green,
				author: {
					name: 'Issue fixed',
					icon_url: msg.author.displayAvatarURL // eslint-disable-line camelcase
				},
				description: 'Your issue has been reviewed and fixed!',
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
			description: `${msg.author}, successfully fixed issue #${issue.id}!`
		})
			.then(async() => {
				const messages = await msg.channel.fetchMessages({ after: msg.id });
				const issueMessage = await msg.channel.fetchMessage(issue.issueMessage);
				messages.deleteAll();
				msg.delete();
				issueMessage.delete();
			});
	}
};
