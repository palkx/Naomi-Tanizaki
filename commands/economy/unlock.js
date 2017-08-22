const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const { PERMITTED_GROUP } = require('../../assets/_data/settings.json');
const _sdata = require('../../assets/_data/static_data.json');
const Currency = require('../../structures/currency/Currency');

module.exports = class UnlockCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unlock',
            group: 'economy',
            memberName: 'unlock',
            description: `\`AL: owner, perm_group\` Enable xp and ${Currency.textSingular} earning in a channel.`,
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            },

            args: [
                {
                    key: 'channel',
                    prompt: 'what channel do you want to unlock?\n',
                    type: 'channel',
                    default: ''
                }
            ]
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author)
   || msg.member.roles.exists('name', PERMITTED_GROUP);
    }

    run(msg, args) {
        const channel = args.channel || msg.channel;
        if (channel.type !== 'text') {
            return msg.embed({
                color: _sdata.colors.blue,
                description: `${msg.author}, you can only unlock text channels.`
            });
        }

        const channelLocks = this.client.provider.get(msg.guild.id, 'locks', []);
        if (!channelLocks.includes(channel.id)) {
            return msg.embed({ color: _sdata.colors.blue, description: `${msg.author}, this channel is not locked.` });
        }

        const index = channelLocks.indexOf(channel.id);
        channelLocks.splice(index, 1);
        this.client.provider.set(msg.guild.id, 'locks', channelLocks);
        return msg.embed({
            color: _sdata.colors.green,
            description: stripIndents`
			${msg.author}, the channel lock has been lifted.
			You can now earn xp and ${Currency.textPlural} in ${channel} again.`
        });
    }
};
