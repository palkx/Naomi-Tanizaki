const { Command } = require('discord.js-commando');
const colors = require('../../assets/_data/colors.json');
const Inventory = require('../../structures/currency/Inventory');
const ItemGroup = require('../../structures/currency/ItemGroup');

module.exports = class ItemGiveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'give',
			aliases: ['give-item', 'give-itmes', 'item-give', 'items-give'],
			group: 'item',
			memberName: 'give',
			description: `Give your items to another user.`,
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'member',
					prompt: 'what user would you like to give your item(s)?\n',
					type: 'member'
				},
				{
					key: 'item',
					prompt: 'what item would you like to give?\n',
					type: 'string'
				},
				{
					key: 'amount',
					label: 'amount of items to give',
					prompt: 'how many do you want to give?\n',
					type: 'integer',
					min: 1
				}
			]
		});
	}

	async run(msg, args) {
		const { user, amount } = args;
		const item = ItemGroup.convert(args.item, amount);
		const inventory = await Inventory.fetchInventory(msg.author.id);
		const itemBalance = inventory.content[item] ? inventory.content[item].amount : 0;

		if (user.id === msg.author.id) {
			return msg.embed({
				color: colors.blue,
				description: `${msg.author}, giving items to yourself won't change anything.`
			});
		}
		if (user.user.bot) {
			return msg.embed({
				color: colors.grey,
				description: `${msg.author}, don't give your items to bots: they're bots, man.`
			});
		}
		if (amount <= 0) {
			return msg.embed({ color: colors.red, description: `${msg.author}, you can't give 0 or less items.` });
		}
		if (amount > itemBalance) {
			return msg.embed({ color: colors.blue, description: `${msg.author}, you have ${itemBalance} ${item}(s).` });
		}

		const itemGroup = new ItemGroup(item, amount);
		const receiveInv = await Inventory.fetchInventory(user.id);

		inventory.removeItems(itemGroup);
		receiveInv.addItems(itemGroup);
		return msg.embed({
			color: colors.green,
			description: `${msg.author}, ${user.displayName} successfully received your item(s)!`
		});
	}
};
