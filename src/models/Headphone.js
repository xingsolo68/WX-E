import { Model, DataTypes } from 'sequelize'

class Headphone extends Model {
    static init(sequelize) {
        super.init(
            {
                productId: {
                    type: DataTypes.INTEGER,
                },
                brand: {
                    type: DataTypes.STRING,
                },
                size: {
                    type: DataTypes.STRING,
                },
                material: {
                    type: DataTypes.STRING,
                },
            },
            {
                sequelize,
                timestamps: true, //If it's false do not add the attributes (updatedAt, createdAt).
                //paranoid: true, //If it's true, it does not allow deleting from the bank, but inserts column deletedAt. Timestamps need be true.
                //underscored: true, //If it's true, does not add camelcase for automatically generated attributes, so if we define updatedAt it will be created as updated_at.
                //freezeTableName: false, //If it's false, it will use the table name in the plural. Ex: Users
                tableName: 'Headphone', //Define table name
            }
        )
        return this
    }
    static associate(models) {
        this.belongsTo(models.Product, { foreignKey: 'productId' })
    }
}

export default Headphone
