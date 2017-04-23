const { Command } = require('discord.js-commando');
const colors = require('../../assets/_data/colors.json');
const { version } = require('../../assets/_data/settings.json');
const request = require('request-promise');

module.exports = class TestCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'shikimori',
			aliases: ['shiki'],
			group: 'util',
			memberName: 'test',
			description: 'Command for testing purposes',
			args: [
				{
					key: 'user',
					prompt: 'Username on shikimori.org?\n',
					type: 'string'
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

	async run(msg, args) {
		const { user } = args;
		const shikiUser = await this._getUser(user);
		if (shikiUser === null) {
			return msg.embed({
				color: colors.red,
				description: 'Your request has no results.'
			});
		}
		const scores = this._getScores(shikiUser);
		return msg.embed({
			author: {
				icon_url: 'https://shikimori.org/favicon.ico', // eslint-disable-line
				name: 'Shikimori',
				url: `https://shikimori.org/${shikiUser.nickname.replace(' ', '+')}`
			},
			color: colors.green,
			fields: [
				{
					name: `**${shikiUser.name !== null ? 'Name / ' : ''}Nickname**`,
					value: `${shikiUser.name !== '' ? `${shikiUser.name} / ` : 'Private / '} ${shikiUser.nickname}`,
					inline: true
				},
				{
					name: '**ID / Banned?**',
					value: `${shikiUser.id} / ${shikiUser.banned ? 'yes' : 'no'}`,
					inline: true
				},
				{
					name: '**AGE / SEX**',
					value: `${shikiUser.full_years !== null
						? `${shikiUser.full_years} years`
						: 'Private'} / ${shikiUser.sex !== null ? shikiUser.sex : 'Private'}`,
					inline: true
				},
				{
					name: '**LOCATION**',
					value: `${shikiUser.location !== '' ? shikiUser.location : 'Private'}`,
					inline: true
				},
				{
					name: `**Scores**`,
					value: scores,
					inline: true
				}
			],
			thumbnail: { url: shikiUser.image.x64 || undefined }
		});
	}

	async _getUser(user) {
		const response = await request({
			uri: `https://shikimori.org/api/users?limit=1&search=${user}`,
			headers: { 'User-Agent': `Naomi Tanizaki v${version} (https://github.com/iSm1le/Naomi-Tanizaki/)` },
			json: true
		});
		if (response.length > 0) {
			const _response = await request({
				uri: `https://shikimori.org/api/users/${response[0].id}`,
				headers: { 'User-Agent': `Naomi Tanizaki v${version} (https://github.com/iSm1le/Naomi-Tanizaki/)` },
				json: true
			});
			if (_response > 0) {
				return _response;
			}
		}
		return null;
	}

	_getScores(user) { // eslint-disable-line complexity
		let scores = '', scoresA = [], scoresM = [];
		const aLength = user.stats.scores.anime.length > 0 ? user.stats.scores.anime.length : false;
		const mLength = user.stats.scores.manga.length > 0 ? user.stats.scores.manga.length : false;
		if (aLength) {
			for (let i = 0; i < aLength; i++) {
				if (!scoresA[i]) scoresA[i] = [];
				scoresA.push(user.stats.scores.anime[i].name);
			}
		}
		if (mLength) {
			for (let i = 0; i < mLength; i++) {
				if (!scoresM[i]) scoresM[i] = [];
				scoresM.push(user.stats.scores.manga[i].name);
			}
		}
		if (aLength || mLength) {
			for (let i = 0; i < 10; i++) {
				let _tmp = '';
				if (i === 0) {
					scores = scores.concat(`${aLength ? 'ANIME' : ''}${mLength ? aLength ? '   |   MANGA' : 'MANGA' : ''}`);
				}
				_tmp = _tmp.concat(`\n${10 - i} : ${aLength ? scoresA.includes(10 - i) ? user.stats.scores.anime[scoresA.indexOf(10 - i) - 1].value : '0' : ''}`); // eslint-disable-line max-len
				if (mLength && aLength) {
					while (_tmp.length < 12) {
						_tmp = _tmp.concat(' ');
					}
				}
				scores = scores.concat(`${_tmp}${mLength ? aLength ? `|   ${10 - i} : ` : `${10 - i} : ` : ''}${mLength ? scoresM.includes(10 - i) ? user.stats.scores.manga[scoresM.indexOf(10 - i) - 1].value : '0' : ''}`); // eslint-disable-line max-len
			}
		} else {
			scores = scores.concat('No ratings');
		}
		return scores;
	}
};
