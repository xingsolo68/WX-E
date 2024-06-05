'use strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Shop', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            password_hash: {
                type: Sequelize.STRING,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            isVerify: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
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
        await queryInterface.dropTable('Shop')
    },
}
