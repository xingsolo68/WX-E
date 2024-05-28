import { faker } from '@faker-js/faker'
import { ProductEntity } from '../../services/product.service'

export class ProductFactory {
    static async create(type = 'Earphone', overridedFields = {}) {
        const defaultFields = {
            name: faker.commerce.productName(),
            price: faker.commerce.price(),
            thumbnail: faker.image.imageUrl(),
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

        const productEntity = new ProductEntity(productData)
        await productEntity.save()

        return productEntity
    }
}
