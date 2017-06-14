const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const _sdata = require('../../assets/_data/static_data.json');
const Store = require('../../structures/currency/Store');

module.exports = class StoreInfoCommand extends Command {
	constructor (client) {
		super(client, {
			name: 'item-info',
			aliases: ['info-item'],
			group: 'item',
			memberName: 'info',
			description: '`AL: low` Displays price of an item.',
			display: 'Displays price of an item.',
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'item',
					prompt: 'which item would you like to know the price of?\n',
					type: 'string',
					parse: str => str.toLowerCase()
				}
			]
		});
	}

	hasPermission (msg) {
		return this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.low;
	}

	run (msg, { item }) {
		const storeItem = Store.getItem(item);
		if (!storeItem) {
			return msg.embed({
				color: _sdata.colors.red,
				description: stripIndents`
				${msg.member}, sorry, but that item doesn't exist.

				You can use ${msg.usage()} to get a list of the available items.`
			});
		}

		const storeItemName = storeItem.name.replace(/(\b\w)/gi, lc => lc.toUpperCase());
		return msg.embed({
			color: _sdata.colors.green,
			description: `${msg.author}, one ${storeItemName} costs ${storeItem.price} 🍩s`
		});
	}
};
