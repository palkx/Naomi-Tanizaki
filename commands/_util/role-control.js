const { Command } = require('discord.js-commando');

module.exports = class RoleControlCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'role-control',
			aliases: ['rc'],
			group: 'util',
			memberName: 'role-control',
			description: 'Control whitelisted roles on user',
            guildOnly: true,
			throttling: {
				usages: 2,
				duration: 10
			},

			args: [
				{
					key: 'job',
					prompt: 'add or remove role?',
					type: 'string',
					validate: job => {
						if(job.toLowerCase() != 'add' && job.toLowerCase() != 'remove') return `Job name must be \'add\' or \'remove\'`;
						return true;
					}
				},

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
		return this.client.provider.get(msg.author.id, 'userLevel', [])[0]>=2?true:false;
	}

    async run(msg, args) {
		try {
			//checks
	        if(!msg.guild.member(this.client.user).hasPermission("MANAGE_ROLES_OR_PERMISSIONS")){
	            return 	msg.embed({ color: 3447003, description: `I dont have **MANAGE_ROLES_OR_PERMISSIONS** permission.`});
	        }

	        const { member } = args;
			const job = args.job.toLowerCase() === 'add' ? true : false;

	        let role = msg.guild.roles.find('name', args.role);
	        if(!role) { return msg.embed({ color: 3447003, description: `${args.role} role does not exist on server.` });}

	        const roleWhitelist = this.client.provider.get(msg.guild.id, 'roleWhitelist', []);
	        if (!roleWhitelist.includes(role.id)) return msg.embed({ color: 3447003, description: `${role} is not whitelisted to manage. Add it to whitelist first.` });

	        const userrolelvl=Math.max.apply(null, msg.member.roles.map(roles => `${roles.position}`));
			const targetuserrolelvl=Math.max.apply(null, member.roles.map(roles => `${roles.position}`));
	        let userrolelvlwant=0;
	        let rolearr=[];
	        for (let i = 0; i < msg.guild.roles.size; i++) {
	            rolearr[parseInt((msg.guild.roles.find('position', i)).position)] = (msg.guild.roles.find('position', i)).name;
	            if (args.role == (msg.guild.roles.find('position', i)).name) userrolelvlwant = i;
	        }
			//checks end
	        if( userrolelvl > userrolelvlwant ) {
				if(job){
		            if( !member.roles.has(role.id) ){
		                member.addRole(role).then( () => { msg.embed({ color: 3447003, description: `${msg.author} successfully added ${role} to ${member}`}); });
		            } else {
		                return msg.embed({ color: 3447003, description: `${member} already have ${role} role on this server.`});
		            }
				} else {
					if( userrolelvl > targetuserrolelvl) {
						if( member.roles.has(role.id) ){
							member.removeRole(role).then( () => { msg.embed({ color: 3447003, description: `${msg.author} successfully removed ${role} from ${member}`}); });
						} else {
							return msg.embed({ color: 3447003, description: `${member} already dont have ${role} role on this server.`});
						}
					} else {
						return msg.embed({ color: 3447003, description: `You cant remove ${role} from ${member} because his highest role is biggest or equal to yours(${msg.guild.roles.find('name',rolearr[targetuserrolelvl])})`});
					}
				}
	        } else {
	            return msg.embed({ color: 3447003, description: `You cant add ${role} to ${member} because your highest role is  ${msg.guild.roles.find('name',rolearr[userrolelvl])}.`});
	        }
	    }catch(err) {winston.error(err);}
	}

};
