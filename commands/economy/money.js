const { Command } = require('discord.js-commando');
const _sdata = require('../../assets/_data/static_data.json');
const { oneLine } = require('common-tags');
const Bank = require('../../structures/currency/Bank');
const Currency = require('../../structures/currency/Currency');

module.exports = class MoneyInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'money',
            aliases: ['bal', 'balance', 'donut', 'donuts', 'doughnut', 'doughnuts'],
            group: 'economy',
            memberName: 'money',
            description: `\`AL: low\` Displays the ${Currency.textPlural} you have earned.`,
            details: `Displays the ${Currency.textPlural} you have earned.`,
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            },

            args: [
                {
                    key: 'member',
                    prompt: `whose ${Currency.textPlural} would you like to view?\n`,
                    type: 'member',
                    default: ''
                }
            ]
        });
    }

    hasPermission(msg) {
        return this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.low;
    }

    async run(msg, args) {
        const member = args.member || msg.author;
        const money = await Currency.getBalance(member.id);
        const balance = await Bank.getBalance(member.id) || 0;
        const networth = (money || 0) + balance;

        if (args.member) {
            if (money === null) {
                return msg.embed({
                    color: _sdata.colors.blue,
                    description: oneLine`${msg.author}, ${member.displayName} hasn't earned any ${Currency.textPlural} yet.` // eslint-disable-line max-len
                });
            }
            return msg.embed({
                color: _sdata.colors.blue,
                description: oneLine`
				${member.displayName} has ${Currency.convert(money)} on hand and
				${Currency.convert(balance)} in the bank.
				Their net worth is ${Currency.convert(networth)}.
				Good on them!`
            });
        } else {
            if (money === null) {
                return msg.embed({
                    color: _sdata.colors.blue,
                    description: `
					${msg.author}, you haven't earned any ${Currency.textPlural} yet.`
                });
            }
            return msg.embed({
                color: _sdata.colors.green,
                description: oneLine`
				${msg.author}, you have ${Currency.convert(money)} on hand and
				${Currency.convert(balance)} in the bank.
				Your net worth is ${Currency.convert(networth)}.
				Good on you!`
            });
        }
    }
};
