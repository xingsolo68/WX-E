'use strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Discounts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            code: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            startDate: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            endDate: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            isActive: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            shopId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            minOrderValue: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            productIds: {
                type: Sequelize.ARRAY(Sequelize.INTEGER),
                allowNull: true,
            },
            appliesTo: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            type: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            value: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            maxValue: {
                type: Sequelize.FLOAT,
                allowNull: true,
            },
            maxUses: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            usesCount: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            maxUsesPerUser: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        })
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Discounts')
    },
}
