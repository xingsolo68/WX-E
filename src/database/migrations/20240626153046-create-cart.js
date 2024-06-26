'use strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Cart', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        })
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Cart')
    },
}
