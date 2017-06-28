const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const { PERMITTED_GROUP } = require('../../assets/_data/settings.json');
const winston = require('winston');
const _sdata = require('../../assets/_data/static_data.json');
module.exports = class LaunchCybernukeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'launch-cybernuke',
            aliases: ['cybernuke'],
            group: 'util',
            memberName: 'cybernuke',
            description: '`AL: owner, full, perm_group` Bans all members that have joined recently, with new accounts.',
            guildOnly: true,

            args: [
                {
                    key: 'join',
                    label: 'member age',
                    prompt: 'how old (in minutes) should a member be for the cybernuke to ignore them (server join date)?', // eslint-disable-line max-len
                    type: 'float',
                    min: 0.1,
                    max: 120
                },
                {
                    key: 'age',
                    label: 'account age',
                    prompt: 'how old (in minutes) should a member\'s account be for the cybernuke to ignore them (account age)?', // eslint-disable-line max-len
                    type: 'float',
                    min: 0.1
                }
            ]
        });
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author)
   || msg.member.roles.exists('name', PERMITTED_GROUP)
   || this.client.provider.get(msg.author.id, 'userLevel') >= _sdata.aLevel.full;
    }

    async run(msg, { age, join }) {
        const statusMsg = await msg.embed({
            color: _sdata.colors.blue,
            description: `${msg.author},  Calculating targeting parameters for cybernuke...`
        });
        await msg.guild.fetchMembers();

        const memberCutoff = Date.now() - (join * 60000);
        const ageCutoff = Date.now() - (age * 60000);
        const members = msg.guild.members.filter(
            mem => mem.joinedTimestamp > memberCutoff && mem.user.createdTimestamp > ageCutoff
        );
        const booleanType = this.client.registry.types.get('boolean');

        await statusMsg.edit('', {
            embed: {
                color: _sdata.colors.blue,
                description: `Cybernuke will strike ${members.size} members; proceed?`
            }
        });
        let response;
        let statusMsg2;

        /* eslint-disable no-await-in-loop */
        while (!statusMsg2) {
            const responses = await msg.channel.awaitMessages(msg2 => msg2.author.id === msg.author.id, {
                maxMatches: 1,
                time: 10000
            });

            if (!responses || responses.size !== 1) {
                await msg.embed({ color: _sdata.colors.blue, description: `${msg.author},  Cybernuke cancelled.` });
                return null;
            }
            response = responses.first();

            if (booleanType.validate(response.content)) {
                if (!booleanType.parse(response.content)) {
                    await response.embed({
                        color: _sdata.colors.blue,
                        description: `${msg.author},  Cybernuke cancelled.`
                    });
                    return null;
                }

                statusMsg2 = await response.embed({
                    color: _sdata.colors.green,
                    description: `${msg.author},  Launching cybernuke...`
                });
            } else {
                await response.embed({
                    color: _sdata.colors.blue,
                    description: stripIndents`
					Unknown response. Please confirm the cybernuke launch with a simple "yes" or "no".
					Awaiting your input, commander...`
                });
            }
        }
        /* eslint-enable no-await-in-loop */

        const fatalities = [];
        const survivors = [];
        const promises = [];

        for (const member of members.values()) {
            promises.push(
                member.send('', {
                    embed: {
                        color: _sdata.colors.red,
                        description: stripIndents`
					Sorry, but you've been automatically targetted by the cybernuke in the "${msg.guild.name}" server.
					This means that you have been banned, likely in the case of a server raid.
					Please contact them if you believe this ban to be in error.`
                    }
                }).catch(winston.error)
                    .then(() => member.ban())
                    .then(() => {
                        fatalities.push(member);
                    })
                    .catch(err => {
                        winston.error(err);
                        survivors.push({
                            member: member.id,
                            error: err
                        });
                    })
                    .then(() => {
                        if (members.size <= 5) return;
                        if (promises.length % 5 === 0) {
                            statusMsg2.edit('', {
                                embed: {
                                    color: _sdata.colors.green,
                                    description: `Launching cybernuke (${Math.round(promises.length / members.size * 100)}%)...` // eslint-disable-line max-len
                                }
                            });
                        }
                    })
            );
        }

        await Promise.all(promises);
        await statusMsg2.edit('', {
            embed: {
                color: _sdata.colors.green,
                description: 'Cybernuke impact confirmed. Casualty report incoming...'
            }
        });
        await response.embed({
            color: _sdata.colors.blue, description: stripIndents`
			__**Fatalities**__
			${fatalities.length > 0 ? stripIndents`
				${fatalities.length} confirmed KIA.

				${fatalities.map(fat => `**-** ${fat.displayName} (${fat.id})`).join('\n')}
			` : 'None'}


			${survivors.length > 0 ? stripIndents`
				__**Survivors**__
				${survivors.length} left standing.

				${survivors.map(srv => `**-** ${srv.member.displayName} (${srv.member.id}): \`${srv.error}\``).join('\n')}
			` : ''}`
        });

        return null;
    }
};
