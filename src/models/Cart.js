import { Model, DataTypes } from 'sequelize'

class Cart extends Model {
    static init(sequelize) {
        super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                },
                userId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                // You can add more fields specific to the Cart if needed
            },
            {
                sequelize,
                timestamps: true,
                freezeTableName: false,
                tableName: 'Cart',
            }
        )

        return this
    }

    static associate(models) {
        this.belongsTo(models.User, {
            foreignKey: 'userId',
        })
        this.belongsToMany(models.Product, {
            through: models.CartItem,
            foreignKey: 'cartId',
            otherKey: 'productId',
        })
    }
}

export default Cart
