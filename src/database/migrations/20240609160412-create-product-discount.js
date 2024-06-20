'use strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('ProductDiscount', {
            productId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'Product',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            discountId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'Discount',
                    key: 'id',
                },
                onDelete: 'CASCADE',
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
        await queryInterface.dropTable('ProductDiscount')
    },
}
