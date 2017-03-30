const { Command } = require('discord.js-commando');

module.exports = class RoleAddCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'role-add',
			aliases: ['ra'],
			group: 'util',
			memberName: 'add-role',
			description: 'Add whitelisted role to a user',
            guildOnly: true,
			throttling: {
				usages: 2,
				duration: 5
			},

			args: [
				{
					key: 'member',
					prompt: 'Add role to who?\n',
					type: 'member'
				},

                {
                    key:'role',
                    prompt: 'which role you want to add?\n',
                    type: 'string'
                }
			]
		});
	}

    hasPermission(msg) {
		return this.client.provider.get(msg.author.id, 'userLevel', [])[0]>=1?true:false;
	}

    async run(msg, args) {
        if(!msg.guild.member(this.client.user).hasPermission("MANAGE_ROLES_OR_PERMISSIONS")){
            return 	msg.embed({ color: 3447003, description: `I dont have **MANAGE_ROLES_OR_PERMISSIONS** permission.`});
        }

        const member = args.member;

        let role = msg.guild.roles.find('name', args.role);
        if(!role) { return msg.embed({ color: 3447003, description: `${args.role} role does not exist on server.` });}

        const roleWhitelist = this.client.provider.get(msg.guild.id, 'roleWhitelist', []);
        if (!roleWhitelist.includes(role.id)) return msg.embed({ color: 3447003, description: `${role} is not whitelisted to manage. Add it to whitelist.` });

        let userrolelvl=Math.max.apply(null, msg.member.roles.map(roles => `${roles.position}`));
        let userrolelvlwant=0;
        let rolearr=[];
        for (let i = 0; i < msg.guild.roles.size; i++) {
            rolearr[parseInt((msg.guild.roles.find('position', i)).position)] = (msg.guild.roles.find('position', i)).name;
            if (args.role == (msg.guild.roles.find('position', i)).name) userrolelvlwant = i;
        }

        if( userrolelvl > userrolelvlwant ) {
            if( !member.roles.has(role.id) ){
                member.addRole(role).then( () => { msg.embed({ color: 3447003, description: `successfully added ${role} to ${member}`}); });
            } else {
                return msg.embed({ color: 3447003, description: `${member} already have ${role} role on this server.`});
            }
        } else {
            return msg.embed({ color: 3447003, description: `You cant add ${role} to ${member} because your highest role is  ${msg.guild.roles.find('name',rolearr[userrolelvl])}.`});
        }
    }

};
