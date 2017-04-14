const { Command } = require('discord.js-commando');
const colors = require('../../assets/_data/colors.json');
module.exports = class StopMusicCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'stop',
			aliases: ['kill', 'stfu'],
			group: 'music',
			memberName: 'stop',
			description: 'Stops the music and wipes the queue.',
			details: 'Only moderators may use this command.',
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			}
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author) || msg.member.hasPermission('MANAGE_MESSAGES');
	}

	run(msg) {
		const queue = this.queue.get(msg.guild.id);
		if (!queue) {
			return msg.embed({
				color: colors.red,
				description: `${msg.author}, there isn't any music playing right now.`
			});
		}
		const song = queue.songs[0];
		queue.songs = [];
		if (song.dispatcher) song.dispatcher.end();
		return msg.embed({
			color: colors.blue,
			description: `${msg.author}, you've just killed the party. Congrats. 👏`
		});
	}

	get queue() {
		if (!this._queue) this._queue = this.client.registry.resolveCommand('music:play').queue;
		return this._queue;
	}
};
