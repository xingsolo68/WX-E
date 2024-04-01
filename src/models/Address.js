import Sequelize, { Model } from 'sequelize'

class Address extends Model {
    static init(sequelize) {
        super.init(
            {
                city: Sequelize.STRING,
                state: Sequelize.STRING,
                neighborhood: Sequelize.STRING,
                country: Sequelize.STRING,
            },
            {
                sequelize,
                timestamps: true,
                tableName: 'Address',
            }
        )

        return this
    }

    static associate(models) {
        this.belongsToMany(models.User, {
            through: 'UserAddress',
            foreignKey: 'addressId',
        })
    }
}

export default Address
