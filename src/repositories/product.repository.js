import { Product } from '../models'

class ProductRepository {
    static async getDraftProductForShop(shopId) {
        return await Product.findAll({
            where: {
                shopId,
                isDraft: true,
            },
        })
    }
}

export default ProductRepository
