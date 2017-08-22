const { Command } = require('discord.js-commando');
const _sdata = require('../../assets/_data/static_data.json');
const { PERMITTED_GROUP } = require('../../assets/_data/settings.json');
const Starboard = require('../../structures/stars/Starboard');

module.exports = class DeleteStarCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'delete-star',
            aliases: ['star-delete', 'star-del', 'del-star'],
            group: 'stars',
            memberName: 'delete',
            description: '`AL: high, perm_group` Add a message to the #starboard!',
            guildOnly: true,

            args: [
                {
                    key: 'message',
                    prompt: 'What message would you like to star?',
                    type: 'message'
                }
            ]
        });
    }

    hasPermission(msg) {
        return msg.member.roles.exists('name', PERMITTED_GROUP)
   || this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.high;
    }

    async run(msg, { message }) {
        const starboard = msg.guild.channels.find('name', 'starboard');
        if (!starboard) {
            return msg.embed({
                color: _sdata.colors.blue,
                description: `${msg.author}, you can't delete stars if you don't even have a starboard.`
            });
        }
        const isStarred = await Starboard.isStarred(message.id);
        if (!isStarred) {
            return msg.embed({
                color: _sdata.colors.red,
                description: `${msg.author}, that message is not on the #starboard.`
            });
        }
        await Starboard.removeStar(message, starboard);
        return msg.embed({
            color: _sdata.colors.green,
            description: `${msg.author}, successfully delete the message from the starboard`
        });
    }
};
