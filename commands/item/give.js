const { Command } = require('discord.js-commando');
const _sdata = require('../../assets/_data/static_data.json');
const Inventory = require('../../structures/currency/Inventory');
const ItemGroup = require('../../structures/currency/ItemGroup');

module.exports = class ItemGiveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'give',
			aliases: ['give-item', 'give-itmes', 'item-give', 'items-give'],
			group: 'item',
			memberName: 'give',
			description: `\`AL: low\` Give your items to another user.`,
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

	hasPermission(msg) {
		return this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.low;
	}

	async run(msg, { member, amount, item }) {
		const _item = ItemGroup.convert(item, amount);
		const inventory = await Inventory.fetchInventory(msg.author.id);
		const itemBalance = inventory.content[_item] ? inventory.content[_item].amount : 0;

		if (member.id === msg.author.id) {
			return msg.embed({
				color: _sdata.colors.blue,
				description: `${msg.author}, giving items to yourself won't change anything.`
			});
		}
		if (member.user.bot) {
			return msg.embed({
				color: _sdata.colors.grey,
				description: `${msg.author}, don't give your items to bots: they're bots, man.`
			});
		}
		if (amount <= 0) {
			return msg.embed({ color: _sdata.colors.red, description: `${msg.author}, you can't give 0 or less items.` });
		}
		if (amount > itemBalance) {
			return msg.embed({
				color: _sdata.colors.blue,
				description: `${msg.author}, you have ${itemBalance} ${_item}(s).`
			});
		}

		const itemGroup = new ItemGroup(_item, amount);
		const receiveInv = await Inventory.fetchInventory(member.id);

		inventory.removeItems(itemGroup);
		receiveInv.addItems(itemGroup);
		return msg.embed({
			color: _sdata.colors.green,
			description: `${msg.author}, ${member.displayName} successfully received your item(s)!`
		});
	}
};
