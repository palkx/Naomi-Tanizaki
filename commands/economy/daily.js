const { Command } = require('discord.js-commando');
const _sdata = require('../../assets/_data/static_data.json');
const moment = require('moment');
const { stripIndents } = require('common-tags');
const Currency = require('../../structures/currency/Currency');
const Daily = require('../../structures/currency/Daily');

module.exports = class DailyCommand extends Command {
	constructor (client) {
		super(client, {
			name: 'daily',
			group: 'economy',
			memberName: 'daily',
			description: `\`AL: low\` Receive or gift your daily ${Currency.textPlural}.`,
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'member',
					prompt: 'whom do you want to give your daily?\n',
					type: 'member',
					default: ''
				}
			]
		});
	}

	hasPermission (msg) {
		return this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.low;
	}

	async run (msg, args) {
		const received = await Daily.received(msg.author.id);
		const member = args.member || msg.member;

		if (received) {
			const nextDaily = await Daily.nextDaily(msg.author.id);
			return msg.embed({
				color: _sdata.colors.blue,
				description: stripIndents`
				${msg.author}, you have already received your daily ${Currency.textPlural}.
				You can receive your next daily in ${moment.duration(nextDaily).format('hh [hours] mm [minutes]')}`
			});
		}

		if (member.id !== msg.author.id) {
			Daily.receive(msg.author.id, member.id);
			return msg.embed({
				color: _sdata.colors.green,
				description: `
				${msg.author}, ${member} has successfully received your daily ${Currency.convert(Daily.dailyDonationPayout)}.`
			});
		}

		Daily.receive(msg.author.id);
		return msg.embed({
			color: _sdata.colors.green,
			description: `${msg.author}, you have successfully received your daily ${Currency.convert(Daily.dailyPayout)}.`
		});
	}
};
