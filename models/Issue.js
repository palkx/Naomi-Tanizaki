const Sequelize = require('sequelize');

const Database = require('../structures/PostgreSQL');

const Issue = Database.db.define('issue', {
    discoveredBy: {
        type: Sequelize.STRING,
        allowNull: false
    },
    issue: {
        type: Sequelize.STRING(2000), // eslint-disable-line new-cap
        allowNull: false
    },
    issueMessage: {
        type: Sequelize.STRING,
        allowNull: true
    },
    processed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    processedBy: {
        type: Sequelize.STRING,
        allowNull: true
    },
    fixed: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    },
    reason: {
        type: Sequelize.STRING(2000), // eslint-disable-line new-cap
        allowNull: true
    }
});

module.exports = Issue;
