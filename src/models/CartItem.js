import { Model, DataTypes } from 'sequelize'

class CartItem extends Model {
    static init(sequelize) {
        super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                },
                cartId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                productId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                quantity: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 1,
                },
                // You can add more fields specific to the CartItem if needed
            },
            {
                sequelize,
                timestamps: true,
                freezeTableName: false,
                tableName: 'CartItem',
            }
        )

        return this
    }

    static associate(models) {
        this.belongsTo(models.Cart, {
            foreignKey: 'cartId',
        })
        this.belongsTo(models.Product, {
            foreignKey: 'productId',
        })
    }
}

export default CartItem
