'use strict'

module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable('UserAddress', {
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'User',
                    key: 'id',
                },
            },
            addressId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Addresses',
                    key: 'id',
                },
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: new Date(),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: new Date(),
            },
        }),

    down: (queryInterface) => queryInterface.dropTable('UserAddress'),
}
