import { required } from 'joi'
import { Model, DataTypes } from 'sequelize'

class Discount extends Model {
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
                    required: true,
                },
                description: {
                    type: DataTypes.STRING,
                    required: true,
                },
                type: {
                    type: DataTypes.STRING,
                    defaultValue: 'fixed_amount',
                },
                value: {
                    type: DataTypes.INTEGER,
                    required: true,
                },
                maxValue: {
                    type: DataTypes.INTEGER,
                    required: true,
                },
                code: {
                    type: DataTypes.STRING,
                    required: true,
                },
                startDate: {
                    type: DataTypes.DATE,
                    required: true,
                },
                endDate: {
                    type: DataTypes.DATE,
                    required: true,
                },
                maxUses: {
                    type: DataTypes.INTEGER,
                    required: true,
                },
                useCount: {
                    type: DataTypes.INTEGER,
                    required: true,
                },
                userUses: {
                    type: DataTypes.ARRAY(DataTypes.JSONB),
                },
                maxUsesPerUser: {
                    type: DataTypes.INTEGER,
                    required: true,
                },
                minOrderValue: {
                    type: DataTypes.STRING,
                    required: true,
                },
                isActive: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: true,
                },
                appliesTo: {
                    type: DataTypes.ENUM('all', 'specific'),
                },
            },
            {
                sequelize,
                timestamps: true, //If it's false do not add the attributes (updatedAt, createdAt).
                //paranoid: true, //If it's true, it does not allow deleting from the bank, but inserts column deletedAt. Timestamps need be true.
                //underscored: true, //If it's true, does not add camelcase for automatically generated attributes, so if we define updatedAt it will be created as updated_at.
                freezeTableName: false, //If it's false, it will use the table name in the plural. Ex: Users
                tableName: 'Discount', //Define table name
            }
        )
        return this
    }

    static associate(models) {
        this.belongsToMany(models.Discount, {
            through: 'ProductDiscount',
            foreignKey: 'discount_id',
            otherKey: 'product_id',
        })
    }
}

export default Discount
