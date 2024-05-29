import { Product } from '../models'

class ProductRepository {
    static async getDraftProductsForShop(shopId) {
        return this.queryProducts({ filter: { shopId, isDraft: true } })
    }

    static async getPublishedProductsForShop(shopId) {
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
}

export default ProductRepository
