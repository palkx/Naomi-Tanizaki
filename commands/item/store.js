const { Command, util } = require('discord.js-commando');
const colors = require('../../assets/_data/colors.json');
const { PAGINATED_ITEMS } = require('../../assets/_data/settings.json');
const Store = require('../../structures/currency/Store');

module.exports = class StoreInfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'store',
			group: 'item',
			memberName: 'store',
			description: 'Displays price of all items.',
			display: 'Displays price of all items.',
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'page',
					prompt: 'which page would you like to view?\n',
					type: 'integer',
					default: 1
				}
			]
		});
	}

	run(msg, { page }) {
		const storeItems = Store.getItems().array();
		const paginated = util.paginate(storeItems, page, Math.floor(PAGINATED_ITEMS));
		if (storeItems.length === 0) {
			return msg.embed({ color: colors.red, description: `${msg.author}, can't show what you don't have, man.` });
		}
		return msg.embed({
			color: colors.green,
			description: `__**Items:**__`,
			fields: [
				{
					name: 'Item',
					value: paginated.items.map(item => item.name.replace(/(\b\w)/gi, lc => lc.toUpperCase())).join('\n'),
					inline: true
				},
				{
					name: 'Price',
					value: paginated.items.map(item => item.price).join('\n'),
					inline: true
				}
			],
			footer: { text: paginated.maxPage > 1 ? `Use ${msg.usage()} to view a specific page.` : '' }
		});
	}
};
