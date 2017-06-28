const { Command, util } = require('discord.js-commando');
const _sdata = require('../../assets/_data/static_data.json');
const { PAGINATED_ITEMS } = process.env;
const Store = require('../../structures/currency/Store');

module.exports = class StoreInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'store',
            group: 'item',
            memberName: 'store',
            description: '`AL: low` Displays price of all items.',
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

    hasPermission(msg) {
        return this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.low;
    }

    run(msg, { page }) {
        const storeItems = Store.getItems().array();
        const paginated = util.paginate(storeItems, page, Math.floor(PAGINATED_ITEMS));
        if (storeItems.length === 0) {
            return msg.embed({
                color: _sdata.colors.red,
                description: `${msg.author}, can't show what you don't have, man.`
            });
        }
        return msg.embed({
            color: _sdata.colors.green,
            description: `__**Items:**__`,
            fields: [
                {
                    name: 'Item',
                    value: paginated.items.map(item => item.name.replace(/(\b\w)/gi, lc => lc.toUpperCase())).join('\n'), // eslint-disable-line max-len
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
