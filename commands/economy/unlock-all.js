const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const { PERMITTED_GROUP } = process.env;
const _sdata = require('../../assets/_data/static_data.json');
const Currency = require('../../structures/currency/Currency');

module.exports = class UnlockAllCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unlock-all',
            group: 'economy',
            memberName: 'unlock-all',
            description: `\`AL: owner, perm_group\` Enable xp and ${Currency.textSingular} earning on all channels.`,
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            }
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author)
   || msg.member.roles.exists('name', PERMITTED_GROUP);
    }

    run(msg) {
        this.client.provider.set(msg.guild.id, 'locks', []);
        return msg.embed({
            color: _sdata.colors.green,
            description: stripIndents`
			${msg.author}, the lock on all channels has been lifted.
			You can now earn xp and ${Currency.textPlural} on the entire server again.`
        });
    }
};
