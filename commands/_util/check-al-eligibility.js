const { Command } = require('discord.js-commando');
const { EXAMPLE_CHANNEL } = process.env;
const _sdata = require('../../assets/_data/static_data.json');

module.exports = class checkALEligibilityCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'check-al-eligibility',
			aliases: ['cule'],
			group: 'util',
			memberName: 'check-al-eligibility',
			description: '`AL: zero` Check eligibility to up AL to `AL: low`',
			throttling: {
				usages: 3,
				duration: 600
			},

			args: [
				{
					key: 'user',
					prompt: 'User?\n',
					type: 'user',
					default: ''
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.zero;
	}

	async run(msg, { user }) {
		let _user = user === '' ? msg.author : user;
		if (!_user.bot) {
			let firstSeen = this.client.provider.get(_user.id, 'firstSeen');
			if (firstSeen === undefined) {
				this.client.provider.set(_user.id, 'firstSeen', Date.now());
				return msg.embed({
					color: _sdata.colors.red,
					description: `${_user}, sorry, but i don't know you long enough`
				});
			} else if ((firstSeen + 604800000) < Date.now()) {
				if (this.client.provider.get(_user.id, 'userLevel') < _sdata.aLevel.low) {
					this.client.provider.set(_user.id, 'userLevel', _sdata.aLevel.low);
					msg.embed({ color: _sdata.colors.green, description: `${_user}, i successfully granted you \`AL: low\`` });
					if (this.client.channels.get(EXAMPLE_CHANNEL)) {
						await this.client.channels.get(EXAMPLE_CHANNEL).send({
							embed: {
								color: _sdata.colors.green,
								author: {
									name: `${this.client.user.tag} (${this.client.user.id})`,
									icon_url: this.client.user.displayAvatarURL // eslint-disable-line camelcase
								},
								description: `This user will get user-manually \`AL: low\` permissions: ${_user}`,
								timestamp: new Date(),
								footer: { text: `AL: low granted-user-manually` }
							}
						});
					}
				} else {
					return msg.embed({
						color: _sdata.colors.red,
						description: `${_user}, sorry, but you already have \`AL: low\` or higher`
					});
				}
			} else {
				return msg.embed({
					color: _sdata.colors.red,
					description: `${_user}, sorry, but i don't know you long enough`
				});
			}
		}
		return null;
	}

};
