import { faker } from '@faker-js/faker'
import ProductService from '../../services/product.service'

export class ProductFactory {
    static async create(type = 'Earphone', overridedFields = {}) {
        const defaultFields = {
            name: faker.commerce.productName(),
            price: faker.commerce.price(),
            thumbnail: faker.image.url(),
            type,
            description: faker.commerce.productDescription(),
            attributes: {
                color: faker.commerce.productMaterial(),
                material: faker.commerce.productMaterial(),
            },
            isDraft: true,
            isPublished: false,
        }

        const productData = { ...defaultFields, ...overridedFields }
        const result = await ProductService.create(type, productData)
        return result
    }
}
