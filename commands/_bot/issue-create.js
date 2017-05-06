const { oneLine } = require('common-tags');
const { Command } = require('discord.js-commando');
const colors = require('../../assets/_data/colors.json');
const Issue = require('../../models/Issue');
const { ISSUE_CHANNEL } = require('../../assets/_data/settings.json');

module.exports = class IssueCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'issue-create',
			aliases: ['iss-c'],
			group: 'bot',
			memberName: 'issue-create',
			description: 'Create a new issue.',
			throttling: {
				usages: 1,
				duration: 300
			},

			args: [
				{
					key: 'issueContent',
					prompt: 'what issue are you having?\n',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { issueContent }) {
		const issuesChannel = this.client.channels.get(ISSUE_CHANNEL);
		if (!issuesChannel || issuesChannel.type !== 'text') {
			return msg.embed({
				color: colors.red,
				description: oneLine`
				${msg.author}, the owner of this bot has not set a valid channel for issues,
				therefore this command is not available.`
			});
		}

		const openIssues = await Issue.count({
			where: {
				discoveredBy: msg.author.id,
				processed: false
			}
		});

		if (openIssues > 5) {
			return msg.embed({
				color: colors.red,
				description: oneLine`
				${msg.author}, you already have 5 open issues.
				Please wait for them to be processed before creating any new ones.`
			});
		}

		const issue = await Issue.create({
			discoveredBy: msg.author.id,
			issue: issueContent
		});
		const issueMessage = await issuesChannel.send({
			embed: {
				color: colors.blue,
				author: {
					name: `${msg.author.tag} (${msg.author.id})`,
					icon_url: msg.author.displayAvatarURL // eslint-disable-line camelcase
				},
				description: issueContent,
				timestamp: new Date(),
				footer: { text: `Issue #${issue.id}` }
			}
		});
		await issue.update({ issueMessage: issueMessage.id });

		return msg.embed({
			color: colors.dark_green,
			description: `${msg.author}, your issue has been acknowledged. Please wait until it has been reviewed.`
		});
	}
};
