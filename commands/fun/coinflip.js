const { Command } = require('discord.js-commando');
const _sdata = require('../../assets/_data/static_data.json');
module.exports = class CoinflipCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'coinflip',
            aliases: ['flip', 'coin'],
            group: 'fun',
            memberName: 'coinflip',
            description: '`AL: low` Flip a coin.',
            throttling: {
                usages: 2,
                duration: 3
            }
        });
    }

    hasPermission(msg) {
        return this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.low;
    }

    async run(msg) { // eslint-disable-line require-await
        return msg.embed({
            color: _sdata.colors.blue,
            description: `I flipped a coin for you and it landed on ${Math.random() < 0.5
                ? '**heads**'
                : '**tails**'}, ${msg.author}.`
        });
    }
};
