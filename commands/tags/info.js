const { Command } = require('discord.js-commando');
const moment = require('moment');
const _sdata = require('../../assets/_data/static_data.json');
const Tag = require('../../models/Tag');

module.exports = class TagWhoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'tag-info',
            aliases: ['info-tag', 'tag-who', 'who-tag'],
            group: 'tags',
            memberName: 'info',
            description: '`AL: low` Displays information about a tag.',
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            },

            args: [
                {
                    key: 'name',
                    label: 'tagname',
                    prompt: 'what tag would you like to have information on?\n',
                    type: 'string',
                    parse: str => str.toLowerCase()
                }
            ]
        });
    }

    hasPermission(msg) {
        return this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.low;
    }

    async run(msg, { name }) {
        const tag = await Tag.findOne({ where: { name, guildID: msg.guild.id } });
        if (!tag) {
            return msg.embed({
                color: _sdata.colors.red,
                description: `A tag with the name **${name}** doesn't exist, ${msg.author}`
            });
        }
        return msg.embed({
            color: _sdata.colors.green,
            fields: [
                {
                    name: 'Username',
                    value: `${tag.userName} (ID: ${tag.userID})`
                },
                {
                    name: 'Guild',
                    value: `${tag.guildName}`
                },
                {
                    name: 'Created at',
                    value: `${moment.utc(tag.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss ZZ')}`
                },
                {
                    name: 'Uses',
                    value: `${tag.uses} `
                }
            ]
        });
    }
};
