const discord_js_commando_1 = require("discord.js-commando");
const request = require("request-promise");

const { version } = require('../../package.json');

class CatgirlCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'catgirl',
            aliases: ['catgirls', 'neko', 'nekos', 'nya', 'nyaa'],
            group: 'anime',
            memberName: 'catgirl',
            description: 'Posts a random catgirl.',
            details: 'Posts a random catgirl. Add `-nsfw` to the command to get nsfw pictures.',
            throttling: {
                usages: 2,
                duration: 3
            },
            args: [
                {
                    key: 'nsfw',
                    prompt: 'would you like to see NSFW pictures?\n',
                    type: 'string',
                    default: ''
                }
            ]
        });
    }

    async run(msg, args) {
        const { nsfw } = args;
        const response = await request({
            uri: `http://catgirls.brussell98.tk/api${nsfw === '-nsfw' ? '/nsfw' : ''}/random`,
            headers: { 'User-Agent': `Hamakaze v${version} (https://github.com/WeebDev/Hamakaze/)` },
            json: true
        });
        return msg.embed({
            color: 3447003,
            author: {
                name: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
                icon_url: msg.author.displayAvatarURL
            },
            image: { url: response.url }
        });
    }
}
exports.default = CatgirlCommand;
