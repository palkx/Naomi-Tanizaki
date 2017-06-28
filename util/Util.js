class Util {
    constructor() {
        throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
    }

    static cleanContent(content, msg) {
        return content.replace(/@everyone/g, '@\u200Beveryone')
            .replace(/@here/g, '@\u200Bhere')
            .replace(/<@&[0-9]+>/g, roles => {
                const replaceID = roles.replace(/<|&|>|@/g, '');
                const role = msg.channel.guild.roles.get(replaceID);
                return `@${role.name}`;
            })
            .replace(/<@!?[0-9]+>/g, user => {
                const replaceID = user.replace(/<|!|>|@/g, '');
                const member = msg.channel.guild.members.get(replaceID);
                return `@${member.user.username}`;
            });
    }

    static getPerm(level = null) {
        const _sdata = require('../assets/_data/static_data.json');
        let array = [], _level = null;
        array.str = [];
        array.int = [];
        for (let ind in _sdata.aLevel) {
            if (_sdata.aLevel.hasOwnProperty(ind)) {
                array.str.push(ind);
                array.int.push(_sdata.aLevel[ind]);
            }
        }
        if (level === null) return array;
        for (let i = 0; i < array.int.length; i++) {
            if (!_level) {
                if (i !== array.int.length - 1) {
                    if (level <= array.int[i]) _level = array.str[i];
                } else {
                    _level = array.str[i];
                }
            }
        }
        return _level;
    }
}

module.exports = Util;
