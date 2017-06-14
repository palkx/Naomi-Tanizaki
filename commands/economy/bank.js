const { Command } = require('discord.js-commando');
const _sdata = require('../../assets/_data/static_data.json');
const { stripIndents } = require('common-tags');
const moment = require('moment');
const Bank = require('../../structures/currency/Bank');
const Currency = require('../../structures/currency/Currency');

module.exports = class BankInfoCommand extends Command {
	constructor (client) {
		super(client, {
			name: 'bank',
			group: 'economy',
			memberName: 'bank',
			description: `\`AL: low\` Displays info about the bank.`,
			details: `Displays the balance and interest rate of the bank.`,
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			}
		});
	}

	hasPermission (msg) {
		return this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.low;
	}

	async run (msg) {
		const balance = await Currency.getBalance('bank');
		const interestRate = await Bank.getInterestRate();
		const nextUpdate = await Bank.nextUpdate();

		return msg.embed({
			color: _sdata.colors.blue,
			description: stripIndents`
			the bank currently has ${Currency.convert(balance)}.
			The current interest rate is ${(interestRate * 100).toFixed(3)}%.
			Interest will be applied in ${moment.duration(nextUpdate).format('hh [hours] mm [minutes]')}.`
		});
	}
};
