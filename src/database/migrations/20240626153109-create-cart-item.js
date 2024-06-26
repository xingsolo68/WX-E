'use strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('CartItem', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            cartId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Cart',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            productId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Product',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1,
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

        // Add a unique constraint to prevent duplicate cart items
        await queryInterface.addConstraint('CartItem', {
            fields: ['cartId', 'productId'],
            type: 'unique',
            name: 'unique_cart_product',
        })
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('CartItem')
    },
}
