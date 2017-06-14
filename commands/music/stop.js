const { Command } = require('discord.js-commando');
const _sdata = require('../../assets/_data/static_data.json');
module.exports = class StopMusicCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'stop',
			aliases: ['kill', 'stfu'],
			group: 'music',
			memberName: 'stop',
			description: '`AL: owner, moderate` Stops the music and wipes the queue.',
			details: 'Only moderators may use this command.',
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			}
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author)
			|| this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.moderate;
	}

	run(msg) {
		const queue = this.queue.get(msg.guild.id);
		if (!queue) {
			return msg.embed({
				color: _sdata.colors.red,
				description: `${msg.author}, there isn't any music playing right now.`
			});
		}
		const song = queue.songs[0];
		queue.songs = [];
		if (song.dispatcher) song.dispatcher.end();
		return msg.embed({
			color: _sdata.colors.blue,
			description: `${msg.author}, you've just killed the party. Congrats. 👏`
		});
	}

	get queue() {
		if (!this._queue) this._queue = this.client.registry.resolveCommand('music:play').queue;
		return this._queue;
	}
};
