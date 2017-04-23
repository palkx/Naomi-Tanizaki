const { Command } = require('discord.js-commando');
const colors = require('../../assets/_data/colors.json');
module.exports = class CoinflipCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'coinflip',
			aliases: ['flip', 'coin'],
			group: 'fun',
			memberName: 'coinflip',
			description: 'Flip a coin.',
			throttling: {
				usages: 2,
				duration: 3
			}
		});
	}

	async run(msg) { // eslint-disable-line require-await
		return msg.embed({
			color: colors.blue,
			description: `I flipped a coin for you and it landed on ${Math.random() < 0.5
			? '**heads**'
			: '**tails**'}, ${msg.author}.`
		});
	}
};
