'use strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Product', {
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
            price: {
                type: Sequelize.FLOAT,
            },
            thumbnail: {
                type: Sequelize.STRING,
            },
            type: {
                type: Sequelize.ENUM(['Speaker', 'Headphone', 'Earphone']),
            },
            description: {
                type: Sequelize.STRING,
            },
            attributes: {
                type: Sequelize.JSONB,
            },
            slug: {
                type: Sequelize.STRING,
            },
            rating: {
                type: Sequelize.INTEGER,
                validate: {
                    min: 1,
                    max: 5,
                },
            },
            isDraft: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            isPublished: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            shopId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Shop',
                    key: 'id',
                },
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        })
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Product')
    },
}
