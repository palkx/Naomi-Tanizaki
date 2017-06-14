const { Command } = require('discord.js-commando');
const _sdata = require('../../assets/_data/static_data.json');
const Currency = require('../../structures/currency/Currency');
module.exports = class MoneyAddCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'add-money',
			aliases: [
				'money-add',
				'add-donut',
				'add-donuts',
				'add-doughnut',
				'add-doughnuts',
				'donut-add',
				'donuts-add',
				'doughnut-add',
				'doughnuts-add'
			],
			group: 'economy',
			memberName: 'add',
			description: `\`AL: full\` Add ${Currency.textPlural} to a certain user.`,
			details: `Add amount of ${Currency.textPlural} to a certain user.`,
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'member',
					prompt: `what user would you like to give ${Currency.textPlural}?\n`,
					type: 'member'
				},
				{
					key: 'donuts',
					label: 'amount of donuts to add',
					prompt: `how many ${Currency.textPlural} do you want to give that user?\n`,
					type: 'integer'
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author)
			|| this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.full;
	}

	run(msg, { member, donuts }) {
		Currency._changeBalance(member.id, donuts);
		return msg.embed({
			color: _sdata.colors.green,
			description: `${msg.author}, successfully added ${Currency.convert(donuts)} to ${member.displayName}'s balance.`
		});
	}
};
