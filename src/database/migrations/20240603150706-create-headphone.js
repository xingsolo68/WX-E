'use strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Headphone', {
            productId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                references: {
                    model: 'Product',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            brand: {
                type: Sequelize.STRING,
            },
            size: {
                type: Sequelize.STRING,
            },
            material: {
                type: Sequelize.STRING,
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
        await queryInterface.dropTable('Headphone')
    },
}
