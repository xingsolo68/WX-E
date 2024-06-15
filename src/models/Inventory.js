import { Model, DataTypes } from 'sequelize'
import slugify from 'slugify'

class Inventory extends Model {
    static init(sequelize) {
        super.init(
            {
                // id: {
                //     primaryKey: True,
                //     type: DataTypes.INTEGER,
                //     allowNull: false,
                // },
                productId: {
                    primaryKey: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'Product',
                        key: 'id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE',
                },
                stock: {
                    type: DataTypes.INTEGER,
                },
                location: {
                    type: DataTypes.STRING,
                },
                reservations: {
                    type: DataTypes.ARRAY(DataTypes.JSONB),
                },
            },
            {
                sequelize,
                timestamps: true, //If it's false do not add the attributes (updatedAt, createdAt).
                //paranoid: true, //If it's true, it does not allow deleting from the bank, but inserts column deletedAt. Timestamps need be true.
                //underscored: true, //If it's true, does not add camelcase for automatically generated attributes, so if we define updatedAt it will be created as updated_at.
                freezeTableName: false, //If it's false, it will use the table name in the plural. Ex: Users
                tableName: 'Inventory', //Define table name
            }
        )

        return this
    }

    static associate(models) {
        this.belongsTo(models.Product, {
            foreignKey: 'productId',
        })
        this.belongsTo(models.Shop, {
            foreignKey: 'shopId',
        })
    }
}

export default Inventory
