const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const djsversion = require('discord.js').version;
const djscversion = require('discord.js-commando').version;
const _sdata = require('../../assets/_data/static_data.json');
const { version } = require('../../package.json');

const { COMMANDO_VERSION } = require('../../assets/_data/settings.json');

module.exports = class AboutCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'about',
            group: 'info',
            memberName: 'about',
            description: '`AL: zero` Displays info about the bot.',
            throttling: {
                usages: 1,
                duration: 60
            }
        });
    }

    hasPermission(msg) {
        return this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.zero;
    }

    async run(msg) { // eslint-disable-line require-await
        return msg.embed({
            color: _sdata.colors.blue,
            description: stripIndents`
				**Naomi Tanizaki**
				**❯ CREATOR:** <@${this.client.options.owner}> (ID: ${this.client.options.owner})
				**❯ BASED ON:** [Commando v${COMMANDO_VERSION}](https://github.com/WeebDev/Commando)
				**❯ LIBRARY:** Discord.js v${djsversion}, Discord.js-Commando v${djscversion}
				**❯ VERSION:** v${version}
				**Naomi Tanizaki is a multipurpose bot.**
				**If you have any suggestions or feedback head over to her server.**
				**You can see her commands by via ${this.client.user} help**
				**❯ WEBSITE:** [WIP](https://naom.me/)
				**❯ [SERVER](https://s.xaff.ru/devdis)**
			`,
            thumbnail: { url: this.client.user.displayAvatarURL }
        });
    }
};
