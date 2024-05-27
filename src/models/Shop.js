import { Model, DataTypes } from 'sequelize'

class Shop extends Model {
    static init(sequelize) {
        super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                },
                email: {
                    type: DataTypes.STRING,
                    unique: true,
                    validate: {
                        isEmail: true,
                    },
                },
                password: DataTypes.VIRTUAL, //When it is VIRTUAL it does not exist in the database
                password_hash: DataTypes.STRING,
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                isVerify: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false,
                },
            },
            {
                sequelize,
                timestamps: true, //If it's false do not add the attributes (updatedAt, createdAt).
                //paranoid: true, //If it's true, it does not allow deleting from the bank, but inserts column deletedAt. Timestamps need be true.
                //underscored: true, //If it's true, does not add camelcase for automatically generated attributes, so if we define updatedAt it will be created as updated_at.
                //freezeTableName: false, //If it's false, it will use the table name in the plural. Ex: Users
                tableName: 'Shop', //Define table name
                hooks: {
                    beforeSave: async (shop, options) => {
                        if (shop.password) {
                            shop.password_hash = await bcrypt.hash(
                                shop.password,
                                8
                            )
                        }
                    },
                },
            }
        )

        return this
    }

    static associate(models) {
        this.hasMany(models.Product, {
            foreignKey: 'shopId',
        })
    }
}

export default Shop
