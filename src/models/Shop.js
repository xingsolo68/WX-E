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
        this.hasMany(models.Discount, {
            foreignKey: 'shopId',
        })
    }
}

export default Shop
