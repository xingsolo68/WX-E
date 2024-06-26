'use strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Cart', 'userId', {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        })

        // Add a unique constraint to ensure one cart per user
        await queryInterface.addConstraint('Cart', {
            fields: ['userId'],
            type: 'unique',
            name: 'unique_user_cart',
        })
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeConstraint('Cart', 'unique_user_cart')
        await queryInterface.removeColumn('Cart', 'userId')
    },
}
