const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const _sdata = require('../../assets/_data/static_data.json');
const { MAX_SONGS } = require('../../assets/_data/settings.json');

module.exports = class MaxSongsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'max-songs',
            group: 'music',
            memberName: 'max-songs',
            description: '`AL: owner, full` Shows or sets the max songs per user.',
            format: '[amount|"default"]',
            details: oneLine`
				This is the maximum number of songs a user may have in the queue.
				The default is ${MAX_SONGS}.
				Only administrators may change this setting.
			`,
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            }
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author)
   || this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.full;
    }

    run(msg, args) {
        if (!args) {
            const maxSongs = this.client.provider.get(msg.guild.id, 'maxSongs', MAX_SONGS);
            return msg.embed({
                color: _sdata.colors.blue,
                description: `${msg.author}, the maximum songs a user may have in the queue at one time is ${maxSongs}.`
            });
        }

        if (args.toLowerCase() === 'default') {
            this.client.provider.remove(msg.guild.id, 'maxSongs');
            return msg.embed({
                color: _sdata.colors.green,
                description: `${msg.author}, set the maximum songs to the default (currently ${MAX_SONGS}).`
            });
        }

        const maxSongs = parseInt(args);
        if (isNaN(maxSongs) || maxSongs <= 0) {
            return msg.embed({ color: _sdata.colors.red, description: `${msg.author}, invalid number provided.` });
        }

        this.client.provider.set(msg.guild.id, 'maxSongs', maxSongs);
        return msg.embed({
            color: _sdata.colors.green,
            description: `${msg.author}, set the maximum songs to ${maxSongs}.`
        });
    }
};
