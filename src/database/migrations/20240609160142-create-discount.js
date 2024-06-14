'use strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Discount', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            description: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            type: {
                type: Sequelize.STRING,
                defaultValue: 'fixed_amount',
            },
            value: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            maxValue: {
                type: Sequelize.INTEGER,
                allowNull: false,
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
            maxUses: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            useCount: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            userUses: {
                type: Sequelize.ARRAY(Sequelize.JSONB),
            },
            maxUsesPerUser: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            minOrderValue: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            isActive: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            appliesTo: {
                type: Sequelize.ENUM('all', 'specific'),
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            shopId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Shop',
                    key: 'id',
                },
            },
        })
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Discount')
    },
}
