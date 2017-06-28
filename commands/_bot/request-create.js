const { oneLine } = require('common-tags');
const { Command } = require('discord.js-commando');
const _sdata = require('../../assets/_data/static_data.json');
const Request = require('../../models/Request');
const { REQUEST_CHANNEL } = require('../../assets/_data/settings.json');

module.exports = class RequestCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'request-create',
            aliases: ['req-c'],
            group: 'bot',
            memberName: 'request-create',
            description: '`AL: low` Request a new feature for any of our projects!',
            guarded: true,
            throttling: {
                usages: 1,
                duration: 300
            },

            args: [
                {
                    key: 'requestContent',
                    prompt: 'what feature would you like to request?\n',
                    type: 'string'
                }
            ]
        });
    }

    hasPermission(msg) {
        return this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.low;
    }

    async run(msg, { requestContent }) {
        const requestsChannel = this.client.channels.get(REQUEST_CHANNEL);
        if (!requestsChannel || requestsChannel.type !== 'text') {
            return msg.embed({
                color: _sdata.colors.red,
                description: oneLine`
				${msg.author}, the owner of this bot has not set a valid channel for requests,
				therefore this command is not available.`
            });
        }

        const openRequests = await Request.count({
            where: {
                requester: msg.author.id,
                processed: false
            }
        });

        if (openRequests > 5) {
            return msg.embed({
                color: _sdata.colors.red,
                description: oneLine`
				${msg.author}, you already have 5 open requests.
				Please wait for them to be processed before creating any new ones.`
            });
        }

        const request = await Request.create({
            requester: msg.author.id,
            request: requestContent
        });
        const requestMessage = await requestsChannel.send({
            embed: {
                color: _sdata.colors.blue,
                author: {
                    name: `${msg.author.tag} (${msg.author.id})`,
                    icon_url: msg.author.displayAvatarURL // eslint-disable-line camelcase
                },
                description: requestContent,
                timestamp: new Date(),
                footer: { text: `Request #${request.id}` }
            }
        });
        await request.update({ requestMessage: requestMessage.id });

        return msg.embed({
            color: _sdata.colors.dark_green,
            description: `${msg.author}, your request has been acknowledged. Please wait until it has been reviewed.`
        });
    }
};
