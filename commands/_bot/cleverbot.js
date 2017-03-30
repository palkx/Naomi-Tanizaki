const { Command } = require('discord.js-commando');
const winston = require('winston');
const config = require('../../settings');
const Clever = require('cleverbot.io');
let re = /<@[0-9].*>/g;
const cleverbotKey = config.cleverbotApiKey;
const cleverbotUser = config.cleverbotApiUser;
if (typeof cleverbots == 'undefined') { var cleverbots=[];}
if (typeof cb == 'undefined') { cb = new Clever(cleverbotUser, cleverbotKey); }

module.exports = class CleverbotCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'clever',
            aliases: ['talk'],
			group: 'bot',
			memberName: 'cleverbot',
			description: 'Talk with bot',
			guildOnly: false,
			throttling: {
				usages: 2,
				duration: 5
			},

            args: [
                {
                    key:'message',
                    prompt: 'what you want to say me?\n',
                    type: 'string'
                }
            ]
		});
	}

	async run(msg, args) {
        try{
            let _id = `${msg.guild ? `${msg.guild.id}` : `${msg.message.author.id}`}`;
            let msgClean = args.message.replace(re, '');

            if (cleverbots.find(element => {
                return element == _id ? true : false;
            })) {
                //session is opened already
                winston.info(`Session ism1le_naomi_${_id} is opened already`);
                cb.setNick(`ism1le_naomi_${_id}`);
                cb.ask(msgClean, function(err, response) {
                    msg.embed({
                        color: 3447003,
                        description: `:pencil: ${response}`,
                    });
                });
            } else {
                //session is needed to open
                winston.info(`Session ism1le_naomi_${_id} is not opened already. Trying to open.`);
                cb.setNick(`ism1le_naomi_${_id}`);
                cb.create(function (err, session) {
                    if(err) {return winston.error(err);}
                    cb.ask(msgClean, function(err, response) {
                        msg.embed({
                            color: 3447003,
                			description: `:pencil: ${response}`,
                        });
                    });
                });
                cleverbots.push(_id);
            }
        }   catch(e) {
            winston.error(e);
        }
	}
};
