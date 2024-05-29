import { Product } from '../models'
import { Op } from 'sequelize'

class ProductRepository {
    static async fetchDraftProducts(shopId) {
        return this.queryProducts({ filter: { shopId, isDraft: true } })
    }

    static async fetchPublishedProducts(shopId) {
        return this.queryProducts({ filter: { shopId, isPublished: true } })
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

        const [_, affectedRows] = await Product.update(
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

        if (affectedRows !== ids.length) {
            throw new Error(
                'One or more products not found or could not be updated'
            )
        }

        return affectedRows
    }

    static async unpublishProducts(shopId, productIds) {
        const ids = Array.isArray(productIds) ? productIds : [productIds]

        const [_, affectedRows] = await Product.update(
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

        if (affectedRows !== ids.length) {
            throw new Error(
                'One or more products not found or could not be updated'
            )
        }

        return affectedRows
    }

    static async fetchAllPublishProducts() {
        return await Product.findAll()
    }
}

export default ProductRepository
