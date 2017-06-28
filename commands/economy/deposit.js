const { Command } = require('discord.js-commando');
const _sdata = require('../../assets/_data/static_data.json');
const { stripIndents } = require('common-tags');
const Bank = require('../../structures/currency/Bank');
const Currency = require('../../structures/currency/Currency');

module.exports = class DepositCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'deposit',
            group: 'economy',
            memberName: 'deposit',
            description: `\`AL: low\` Deposit ${Currency.textPlural} into the bank.`,
            details: `Deposit ${Currency.textPlural} into the bank.`,
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            },

            args: [
                {
                    key: 'donuts',
                    label: 'amount of donuts to deposit',
                    prompt: `how many ${Currency.textPlural} do you want to deposit?\n`,
                    validate: donuts => /^(?:\d+|all|-all|-a)$/g.test(donuts),
                    parse: async(donuts, msg) => {
                        const balance = await Currency.getBalance(msg.author.id);

                        if (['all', '-all', '-a'].includes(donuts)) return parseInt(balance);
                        return parseInt(donuts);
                    }
                }
            ]
        });
    }

    hasPermission(msg) {
        return this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.low;
    }

    async run(msg, { donuts }) {
        if (donuts <= 0) {
            return msg.embed({
                color: _sdata.colors.red,
                description: `${msg.author}, you can't deposit 0 or less ${Currency.convert(0)}.
			`
            });
        }

        const userBalance = await Currency.getBalance(msg.author.id);
        if (userBalance < donuts) {
            return msg.embed({
                color: _sdata.colors.red,
                description: stripIndents`
				${msg.author}, you don't have that many ${Currency.textPlural} to deposit!
				You currently have ${Currency.convert(userBalance)} on hand.
			`
            });
        }

        Bank.deposit(msg.author.id, donuts);
        return msg.embed({
            color: _sdata.colors.green,
            description: `${msg.author}, successfully deposited ${Currency.convert(donuts)} to the bank!
			`
        });
    }
};
