const Sequelize = require('sequelize');

const Database = require('../structures/PostgreSQL');

const Request = Database.db.define('requests', {
    requester: {
        type: Sequelize.STRING,
        allowNull: false
    },
    request: {
        type: Sequelize.STRING(2000), // eslint-disable-line new-cap
        allowNull: false
    },
    requestMessage: {
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
    approved: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    },
    reason: {
        type: Sequelize.STRING(2000), // eslint-disable-line new-cap
        allowNull: true
    }
});

module.exports = Request;
