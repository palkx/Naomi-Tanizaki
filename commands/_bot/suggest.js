const { Command } = require('discord.js-commando');
const winston = require('winston');
const { stripIndents } = require('common-tags');

module.exports = class SuggestCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'suggest',
			group: 'bot',
			memberName: 'suggest',
			description: 'Send a **feature request** to the Bot Developer. Requests can have a max length of **1900 characters**',
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 120
			},

            args: [
                {
                    key: 'suggestion',
                    prompt: 'what you want to suggest?\n',
                    max: 1900,
                    wait: 60,
                    type: 'string'
                }
            ]
		});
	}

	async run(msg, args) {
	    try {
			this.client.channels.find('id', '279240881607933953').send({
	                    embed: {
	                        author: {
	                            name: `${msg.author.username} (${msg.channel.guild.name})`,
	                            icon_url: msg.author.avatarURL
	                        },
	                        color: 3447003,
	                        description: args.suggestion,
	                        footer: {
	                            text: `User: ${msg.author.username}#${msg.author.discriminator} UserID: ${msg.author.id} GuildID: ${msg.channel.guild.id}`
	                        }
	                    }
	                }).then( () => {
	                        msg.embed({
	                        color: 3447003,
	                        description: stripIndents`
	                            Your request was successfully sent, **${msg.author.username}#${msg.author.discriminator}**
	                        `
	                    });
	            })
	   }catch(err) {
	        winston.error(err);
	    }
	}
}
