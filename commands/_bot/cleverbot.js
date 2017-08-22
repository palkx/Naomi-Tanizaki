const { Command } = require('discord.js-commando');
const winston = require('winston');
const { CLEVERBOT_API_KEY, CLEVERBOT_API_USER } = require('../../assets/_data/settings.json');
const _sdata = require('../../assets/_data/static_data.json');
const Clever = require('cleverbot.io');
let re = /<@[0-9].*>/g;
if (typeof cleverbots === 'undefined') { var cleverbots = []; }
if (typeof cb === 'undefined') { var cb = new Clever(CLEVERBOT_API_USER, CLEVERBOT_API_KEY); }

module.exports = class CleverbotCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'clever',
            aliases: ['talk'],
            group: 'bot',
            memberName: 'cleverbot',
            description: '`AL: low` Talk with bot',
            guildOnly: false,
            throttling: {
                usages: 2,
                duration: 5
            },

            args: [
                {
                    key: 'message',
                    prompt: 'what you want to say me?\n',
                    type: 'string'
                }
            ]
        });
    }

    hasPermission(msg) {
        return this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.low;
    }

    async run(msg, { message }) { // eslint-disable-line require-await
        try {
            let _id = msg.guild ? msg.guild.id : msg.message.author.id;
            let msgClean = message.replace(re, '');
            cb.setNick(`naomi_${_id}`);

            if (cleverbots.find(element => { // eslint-disable-line arrow-body-style
                return element === _id;
            })) {
                // Session is opened already
                winston.info(`Session naomi_${_id} is opened already`);
                cb.ask(msgClean, (err, response) => {
                    if (err) return winston.error(err);
                    return msg.embed({
                        color: _sdata.colors.blue,
                        description: `:pencil: ${response}`
                    });
                });
            } else {
                // Session is needed to open
                winston.info(`Session naomi_${_id} is not opened already. Trying to open.`);
                cb.create(_err => { // eslint-disable-line consistent-return
                    if (_err) return winston.error(_err);
                    cb.ask(msgClean, (err, response) => {
                        if (err) return winston.error(err);
                        return msg.embed({
                            color: _sdata.colors.blue,
                            description: `:pencil: ${response}`
                        });
                    });
                });
                cleverbots.push(_id);
            }
        } catch (err) {
            winston.error(err);
        }
    }
};
