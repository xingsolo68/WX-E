import { Product, Earphone, Headphone, Speaker } from '../models'
import { Op } from 'sequelize'
import _ from 'lodash'

const subtypeModels = {
    Earphone,
    Headphone,
    Speaker,
}

class ProductRepository {
    static async fetchDraftProducts(shopId) {
        return await this.queryProducts({ filter: { shopId, isDraft: true } })
    }

    static async fetchPublishedProducts(shopId) {
        return await this.queryProducts({
            filter: { shopId, isPublished: true },
        })
    }

    static async queryProducts({
        limit = 10,
        page = 1,
        filter = {},
        select = [],
        order = [],
    } = {}) {
        const offset = (page - 1) * limit

        const options = {
            where: filter,
            limit,
            offset,
            order,
        }

        if (select.length > 0) {
            options.attributes = select
        }

        const products = await Product.findAll(options)

        return products
    }

    static async publishProducts(shopId, productIds) {
        const ids = Array.isArray(productIds) ? productIds : [productIds]

        const [affectedRows, b] = await Product.update(
            { isPublished: true, isDraft: false },
            {
                where: {
                    id: {
                        [Op.in]: ids,
                    },
                    shopId: shopId,
                },
                returning: true, // Ensure this works only if your DB supports it
            }
        )

        if (affectedRows === 0) {
            throw new Error(
                'One or more products not found or could not be updated'
            )
        }

        return affectedRows
    }

    static async unpublishProducts(shopId, productIds) {
        const ids = Array.isArray(productIds) ? productIds : [productIds]

        const [affectedRows, _] = await Product.update(
            { isPublished: false, isDraft: true },
            {
                where: {
                    id: {
                        [Op.in]: ids,
                    },
                    shopId: shopId,
                },
                returning: true, // Ensure this works only if your DB supports it
            }
        )

        if (affectedRows === 0) {
            throw new Error(
                'One or more products not found or could not be updated'
            )
        }

        return affectedRows
    }

    static async fetchAllPublishProducts() {
        return await Product.findAll({
            where: { isPublished: true },
        })
    }

    static async updateProductAndSubtype(
        { shopId, productId },
        updateData = {}
    ) {
        if (!shopId || !productId) {
            throw new Error('Both shopId and productId are required')
        }
        const { attributes = {}, ...productUpdateData } = updateData
        const transaction = await Product.sequelize.transaction()

        try {
            // Update Product
            const [affectedRows, updatedProduct] = await Product.update(
                productUpdateData,
                {
                    where: { id: productId, shopId },
                    returning: true,
                    raw: true,
                    transaction,
                }
            )

            if (affectedRows === 0) {
                throw new Error('Product not found or no changes made')
            }

            const subtypeModel = subtypeModels[updatedProduct[0].type]

            if (attributes && subtypeModel) {
                // Prepare Subtype Update Data
                const subtypeFields = _.without(
                    Object.keys(subtypeModel.rawAttributes),
                    'productId',
                    'createdAt',
                    'updatedAt'
                )
                const subtypeUpdateData = _.pick(attributes, subtypeFields)

                if (!_.isEmpty(subtypeUpdateData)) {
                    // Update Subtype
                    const [updateCount] = await subtypeModel.update(
                        subtypeUpdateData,
                        {
                            where: { productId },
                            transaction,
                        }
                    )

                    if (updateCount === 0) {
                        throw new Error(
                            `${subtypeModel.name} not found or no changes made`
                        )
                    }
                }
            }

            // Commit Transaction
            await transaction.commit()
        } catch (error) {
            // Rollback Transaction in Case of Error
            await transaction.rollback()
            throw error
        }
    }
}

export default ProductRepository
