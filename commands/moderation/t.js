const { Command } = require('discord.js-commando');
const winston = require('winston');

module.exports = class TCommand extends Command {
	constructor(client) {
		super(client, {
			name: 't',
			group: 'moderation',
			memberName: 't',
			description: '~~~~',
            guildOnly: true,
			throttling: {
				usages: 2,
				duration: 5
			},

			args: [
				{
					key: 'user',
					prompt: 'what user level should get changed?\n',
					type: 'user'
				}
			]
		});
	}

    hasPermission(msg) {
		return this.client.provider.get(msg.author.id, 'userLevel', [])[0]>2?true:false;
	}

    async run(msg, args) {
        try{
			const user = args.user;
			//const userlevel = this.client.provider.get(user.id, 'userLevel', []);
			//msg.reply(this.client.provider.get(user.id, 'userLevel', [])[0]);
            /*let rolearr=[];
            for (let i = 0; i < msg.guild.roles.size; i++) {
                rolearr[parseInt((msg.guild.roles.find('position', i)).position)] = (msg.guild.roles.find('position', i)).name;
            }
            let userrolelvl=Math.max.apply(null, msg.member.roles.map(roles => `${roles.position}`));
            console.log(rolearr[userrolelvl]);*/
			/*if(msg.member.hasPermission("MANAGE_ROLES_OR_PERMISSIONS")){
				msg.channel.sendMessage("Yes");
			}*/
    } catch(e) {winston.error(e);};
    }

};
