const { Command } = require('discord.js-commando');
const { version } = require('../../package.json');
const { PERMITTED_GROUP } = require('../../assets/_data/settings.json');
const _sdata = require('../../assets/_data/static_data.json');
const request = require('request-promise');

module.exports = class E621Command extends Command {
    constructor(client) {
        super(client, {
            name: 'e621',
            group: 'nsfw',
            memberName: 'e621',
            description: '`AL: low` Random picture from e621.net. Usable only in nsfw channels.',
            throttling: {
                usages: 1,
                duration: 15
            },

            args: [{
                key: 'tags',
                default: '',
                prompt: 'Set of tags',
                type: 'string'
            }]
        });
    }

    hasPermission(msg) {
        if (msg.channel.type === 'dm') return true;
        return (this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.low
   && msg.channel.name.toLowerCase().indexOf('nsfw') > -1)
   || msg.member.roles.exists('name', PERMITTED_GROUP);
    }

    async run(msg, { tags }) {
        const _tags = tags.replace(' ', '+');
        const page = _tags === '' ? Math.floor((Math.random() * 13500) + 1) : 1;
        const response = await request({
            uri: `https://e621.net/post/index.json?tags=${_tags}&page=${page}`,
            headers: { 'User-Agent': `Naomi Tanizaki v${version} (https://github.com/iSm1le/Naomi-Tanizaki/)` },
            json: true
        });
        if (response.length === 0) {
            return msg.embed({
                color: _sdata.colors.red,
                description: 'your request returned no results.'
            });
        }
        const _id = Math.floor((Math.random() * response.length) + 1);
        return msg.embed({
            author: {
                icon_url: msg.author.displayAvatarURL, // eslint-disable-line camelcase
                name: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
                url: `https://e621.net/post/show/${response[_id].id}`
            },
            color: _sdata.colors.green,
            fields: [
                {
                    name: 'ID',
                    value: response[_id].id,
                    inline: true
                }
            ],
            image: { url: response[_id].sample_url || undefined },
            footer: { text: `Tags: ${response[_id].tags}` }
        });
    }
};
