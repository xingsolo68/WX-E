import { Model, DataTypes } from 'sequelize'

class Product extends Model {
    static init(sequelize) {
        super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                price: {
                    type: DataTypes.FLOAT,
                },
                thumbnail: {
                    type: DataTypes.STRING,
                },
                type: DataTypes.ENUM(['Speaker', 'Headphone', 'Earphone']),
                description: DataTypes.STRING,
                attributes: DataTypes.JSONB,
            },
            {
                sequelize,
                timestamps: true, //If it's false do not add the attributes (updatedAt, createdAt).
                //paranoid: true, //If it's true, it does not allow deleting from the bank, but inserts column deletedAt. Timestamps need be true.
                //underscored: true, //If it's true, does not add camelcase for automatically generated attributes, so if we define updatedAt it will be created as updated_at.
                //freezeTableName: false, //If it's false, it will use the table name in the plural. Ex: Users
                tableName: 'Product', //Define table name
            }
        )
        return this
    }

    static associate(models) {
        this.hasOne(models.Speaker, {
            foreignKey: 'productId',
        })
        this.hasOne(models.Earphone, {
            foreignKey: 'productId',
        })
        this.hasOne(models.Headphone, {
            foreignKey: 'productId',
        })
        this.hasMany(models.ProductItem, {
            foreignKey: 'productId',
        })
    }
}

export default Product
