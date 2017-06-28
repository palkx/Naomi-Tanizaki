const { Command } = require('discord.js-commando');
const _sdata = require('../../assets/_data/static_data.json');
const Starboard = require('../../structures/stars/Starboard');

module.exports = class UnstarCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unstar',
            group: 'stars',
            memberName: 'unstar',
            description: '`AL: zero` Remove your star from a message on the #starboard!',
            guildOnly: true,

            args: [
                {
                    key: 'message',
                    prompt: 'What message would you like to unstar?',
                    type: 'message'
                }
            ]
        });
    }

    hasPermission(msg) {
        return this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.zero;
    }

    async run(msg, { message }) {
        const starboard = msg.guild.channels.find('name', 'starboard');
        if (!starboard) {
            return msg.embed({
                color: _sdata.colors.red,
                description: `${msg.author}, you can't unstar things without a #starboard...`
            });
        }
        const hasStarred = await Starboard.hasStarred(message.id, msg.author.id);
        if (!hasStarred) {
            return msg.embed({
                color: _sdata.colors.red,
                description: `${msg.author}, you never starred this message.'
                `
            });
        }
        Starboard.removeStar(message, starboard, msg.author.id);
        return null;
    }
};
