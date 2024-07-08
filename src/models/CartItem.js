import { Model, DataTypes } from 'sequelize'

class CartItem extends Model {
    static init(sequelize) {
        super.init(
            {
                cartId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                productId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                quantity: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 1,
                },
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
