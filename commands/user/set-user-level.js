const { Command } = require('discord.js-commando');

module.exports = class SetUserLevelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'set-user-level',
            aliases: ['sul'],
			group: 'user',
			memberName: 'set-user-level',
			description: 'Set command access level',
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
				},

                {
                    key: 'level',
                    prompt: 'what level you want to set?(from 0 to 100)',
                    type: 'integer',
                    min: 0,
                    max: 100,
                    wait: 10
                }
			]
		});
	}

	hasPermission(msg) {
		return this.client.options.owner === msg.author.id;
	}

	async run(msg, args) {
		const user = args.user;
        const level = args.level;

		const userlevel = this.client.provider.get(user.id, 'userLevel', []);
		//if (!userlevel.includes(user.id)) return msg.reply('that user is not blacklisted.');

		const index = userlevel.indexOf(user.id);
		userlevel.splice(index, 1);

        userlevel.push(level);
		this.client.provider.set(user.id, 'userLevel', userlevel);

		return msg.reply(`You have been set ${level} level to ${user.username}#${user.discriminator}`);
	}
};
