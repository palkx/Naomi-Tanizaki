const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const colors = require('../../assets/_data/colors.json');
const Currency = require('../../structures/currency/Currency');
const RussianRoulette = require('../../structures/games/RussianRoulette');

module.exports = class RussianRouletteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'russian-roulette',
			aliases: ['rus-roulette'],
			group: 'games',
			memberName: 'russian-roulette',
			description: `Play a game of russian roulette for ${Currency.textPlural}!`,
			details: `Play a game of russian roulette for ${Currency.textPlural}.`,
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 30
			}
		});
	}

	async run(msg) {
		const donuts = 120;
		const balance = await Currency.getBalance(msg.author.id);
		let roulette = RussianRoulette.findGame(msg.guild.id);

		if (balance < donuts) {
			return msg.embed({
				color: colors.red,
				description: stripIndents`
				you don't have enough ${Currency.textPlural}.
				Your current account balance is ${Currency.convert(balance)}.
				You need ${Currency.convert(donuts)} to join.`
			});
		}

		if (roulette) {
			if (roulette.hasPlayer(msg.author.id)) {
				return msg.embed({
					color: colors.red,
					description: `${msg.author}, you have already joined this game of russian roulette.`
				});
			}
			if (roulette.players.length === 6) {
				return msg.embed({
					color: colors.red,
					description: 'only 6 people can join at a time. You\'ll have to wait for the next round'
				});
			}

			roulette.join(msg.author, donuts);
			return msg.embed({ color: colors.green, description: `${msg.author}, you have successfully joined the game.` });
		}

		roulette = new RussianRoulette(msg.guild.id);
		roulette.join(msg.author, donuts);

		const barrel = this.generateBarrel();

		return msg.embed({
			color: colors.blue,
			description: stripIndents`
			A new game of russian roulette has been initiated!

			Use the ${msg.usage()} command in the next 15 seconds to join!`
		}).then(async () => {
			setTimeout(() => msg.embed({
				color: colors.blue,
				description: '5 more seconds for new people to join'
			}), 10000);
			setTimeout(() => {
				if (roulette.players.length > 1) {
					msg.embed({
						color: colors.blue,
						description: 'The game begins!'
					});
				}
			}, 14500);

			const players = await roulette.awaitPlayers(15000);

			if (players.length === 1) {
				return msg.embed({
					color: colors.blue,
					description: 'Seems like no one else wanted to join. Ah well, maybe another time.'
				});
			}

			let deadPlayer = null;
			let survivors = [];

			for (const slot in barrel) {
				let currentPlayer = players[slot % players.length];
				if (!deadPlayer) deadPlayer = currentPlayer;
			}

			survivors = players.filter(player => player !== deadPlayer);

			Currency.removeBalance(deadPlayer.user.id, donuts);
			survivors.forEach(survivor => Currency.addBalance(survivor.user.id, donuts / survivors.length));

			return msg.embed({
				color: colors.grey,
				description: stripIndents`
					__**Survivors**__
					${survivors.map(survivor => survivor.user.username).join('\n')}

					__**Reward**__
					The survivors receive ${Currency.convert(donuts / survivors.length)} each.
				`
			});
		});
	}

	generateBarrel() {
		let barrel = [0, 0, 0, 0, 0, 0];
		barrel[Math.floor(Math.random() * barrel.length)] = 1;
		return barrel;
	}
};
