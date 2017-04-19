const { Command } = require('discord.js-commando');
const colors = require('../../assets/_data/colors.json');

module.exports = class SetUserLevelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'get-icon',
			aliases: ['gi'],
			group: 'util',
			memberName: 'get-icon',
			description: 'With this command you can get avatar of user or server.',

			args: [
				{
					key: 'obj',
					prompt: 'must be **user** or **server** ID\n',
					type: 'string',
					default: 'user',
					validate: obj => {
						if (['user', 'server'].includes(obj)) {
							return true;
						}
						return `Job name must be **user** or **server**`;
					}
				},

				{
					key: 'user',
					prompt: 'please enter a valid user\n',
					type: 'user',
					default: ''
				}
			]
		});
	}

	async run(msg, args) {
		const { user } = args;
		const obj = args.obj === 'user';
		await msg.embed({
			color: colors.green,
			description: `Here **${obj ? user.tag : msg.guild.name}\`s** avatar:`,
			image: { url: obj ? user.avatarURL : msg.guild.iconURL || undefined }
		});
		return null;
	}
};
