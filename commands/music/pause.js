const { Command } = require('discord.js-commando');
const _sdata = require('../../assets/_data/static_data.json');

module.exports = class PauseSongCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pause',
            aliases: ['shh', 'shhh', 'shhhh', 'shhhhh'],
            group: 'music',
            memberName: 'pause',
            description: '`AL: low` Pauses the currently playing song.',
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            }
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author)
   || this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.low;
    }

    run(msg) {
        const queue = this.queue.get(msg.guild.id);
        if (!queue) {
            return msg.embed({
                color: _sdata.colors.red,
                description: `${msg.author}, there isn't any music playing to pause, oh brilliant one.`
            });
        }
        if (!queue.songs[0].dispatcher) {
            return msg.embed({
                color: _sdata.colors.red,
                description: `${msg.author}, I can't pause a song that hasn't even begun playing yet.`
            });
        }
        if (!queue.songs[0].playing) {
            return msg.embed({
                color: _sdata.colors.red,
                description: `${msg.author}, pausing a song that is already paused is a bad move.`
            });
        }
        queue.songs[0].dispatcher.pause();
        queue.songs[0].playing = false;
        return msg.embed({
            color: _sdata.colors.green,
            description:
                `${msg.author}, paused the music. Use \`${this.client.commandPrefix}resume\` to continue playing.`
        });
    }

    get queue() {
        if (!this._queue) this._queue = this.client.registry.resolveCommand('music:play').queue;
        return this._queue;
    }
};
