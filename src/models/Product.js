import { Model, DataTypes } from 'sequelize'
import { toDefaultValue } from 'sequelize/lib/utils'
import slugify from 'slugify'

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
                slug: DataTypes.STRING, //
                rating: {
                    type: DataTypes.INTEGER,
                    validate: {
                        min: 1,
                        max: 5,
                    },
                    set(value) {
                        this.setDataValue('rating', Math.round(value * 10) / 10)
                    },
                },
                isDraft: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: true,
                },
                isPublished: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false,
                },
            },
            {
                sequelize,
                timestamps: true, //If it's false do not add the attributes (updatedAt, createdAt).
                //paranoid: true, //If it's true, it does not allow deleting from the bank, but inserts column deletedAt. Timestamps need be true.
                //underscored: true, //If it's true, does not add camelcase for automatically generated attributes, so if we define updatedAt it will be created as updated_at.
                freezeTableName: false, //If it's false, it will use the table name in the plural. Ex: Users
                tableName: 'Product', //Define table name
                hooks: {
                    beforeSave: (product, options) => {
                        console.log(
                            '=========================',
                            slugify(product.name, { lower: true })
                        )
                        product.slug = slugify(product.name, { lower: true })
                    },
                },
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
        this.hasOne(models.Inventory, {
            foreignKey: 'productId',
        })
        this.belongsTo(models.Shop, {
            foreignKey: 'shopId',
        })
        this.belongsToMany(models.Discount, {
            through: 'ProductDiscount',
            foreignKey: 'product_id',
            otherKey: 'discount_id',
            as: 'discounts',
        })
    }
}

export default Product
