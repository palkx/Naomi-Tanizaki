const { Command } = require('discord.js-commando');
const _sdata = require('../../assets/_data/static_data.json');
const { version } = require('../../package.json');
const request = require('request-promise');
const { oneLine } = require('common-tags');

module.exports = class TestCommand extends Command {
	constructor (client) {
		super(client, {
			name: 'shikimori',
			aliases: ['shiki'],
			group: 'anime',
			memberName: 'shikimori',
			description: '`AL: low` Get user profile from shikimori.org',
			throttling: {
				usages: 1,
				duration: 5
			},
			args: [
				{
					key: 'user',
					prompt: 'Username on shikimori.org?\n',
					type: 'string',
					parse: user => user.replace(' ', '+')
				}
			]
		});
	}

	hasPermission (msg) {
		return this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.low;
	}

	async run (msg, { user }) {
		const shikiUser = await this._getUser(user);
		if (shikiUser === null) {
			return msg.embed({
				color: _sdata.colors.red,
				description: 'Your request has no results.'
			});
		}
		const scoresA = this._getScores(shikiUser, 'anime');
		const scoresM = this._getScores(shikiUser, 'manga');
		return msg.embed({
			author: {
				icon_url: 'https://shikimori.org/favicon.ico', // eslint-disable-line
				name: 'Shikimori',
				url: `https://shikimori.org/${shikiUser.nickname.replace(' ', '+')}`
			},
			color: _sdata.colors.green,
			fields: [
				{
					name: `**${shikiUser.name !== null && shikiUser.name !== '' ? 'Name / ' : ''}Nickname**`,
					value: oneLine`${shikiUser.name !== '' && shikiUser.name !== null
						? `${shikiUser.name} / `
						: 'Private / '} ${shikiUser.nickname}`,
					inline: true
				},
				{
					name: '**ID / Banned?**',
					value: `${shikiUser.id} / ${shikiUser.banned ? 'yes' : 'no'}`,
					inline: true
				},
				{
					name: '**AGE / SEX**',
					value: oneLine`${shikiUser.full_years !== null && shikiUser.full_years !== ''
						? `${shikiUser.full_years} years`
						: 'Private'} / 
						${shikiUser.sex !== null && shikiUser.sex !== '' ? shikiUser.sex : 'Private'}`,
					inline: true
				},
				{
					name: '**LOCATION**',
					value: oneLine`${shikiUser.location !== '' && shikiUser.location !== null
						? shikiUser.location : 'Private'}`,
					inline: true
				},
				{
					name: `**Anime ratings**`,
					value: scoresA,
					inline: true
				},
				{
					name: `**Manga ratings**`,
					value: scoresM,
					inline: true
				},
				{
					name: `**Last online**`,
					value: shikiUser.last_online,
					inline: true
				}
			],
			thumbnail: { url: shikiUser.image.x64 || undefined }
		});
	}

	async _getUser (user) {
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
			return _response;
		}
		return null;
	}

	_getScores (user, type) { // eslint-disable-line complexity
		const job = ['anime', 'manga'].includes(type) ? type === 'anime' ? 1 : 2 : 0;
		let scores = '';
		switch (job) {
			case 0:
				return null;
			case 1: // eslint-disable-line
				let scoresA = [];
				const aLength = user.stats.scores.anime.length > 0 ? user.stats.scores.anime.length : false;
				if (!aLength) {
					scores = scores.concat('No ratings');
					return scores;
				}
				for (let i = 0; i < aLength; i++) {
					if (!scoresA[i]) scoresA[i] = [];
					scoresA.push(user.stats.scores.anime[i].name);
				}
				for (let i = 0; i < 10; i++) {
					scores = scores.concat(`\n${10 - i} : ${scoresA.includes(10 - i) ? user.stats.scores.anime[scoresA.indexOf(10 - i) - 1].value : '0'}`); // eslint-disable-line max-len
				}
				break;
			case 2: // eslint-disable-line
				let scoresM = [];
				const mLength = user.stats.scores.manga.length > 0 ? user.stats.scores.manga.length : false;
				if (!mLength) {
					scores = scores.concat('No ratings');
					return scores;
				}
				for (let i = 0; i < mLength; i++) {
					if (!scoresM[i]) scoresM[i] = [];
					scoresM.push(user.stats.scores.manga[i].name);
				}
				for (let i = 0; i < 10; i++) {
					scores = scores.concat(`\n${10 - i} : ${scoresM.includes(10 - i) ? user.stats.scores.manga[scoresM.indexOf(10 - i) - 1].value : '0'}`); // eslint-disable-line max-len
				}
				break;
		}
		return scores;
	}
};
