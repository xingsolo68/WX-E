import { describe, it, expect, afterAll, beforeAll } from 'vitest'
import sequelizeService from '../../services/sequelize.service'
import ProductService from '../../services/product.service'
import { Earphone, Product, Shop } from '../../models'
import slugify from 'slugify'
import { ProductFactory } from '../factories/product.factory'
import ProductRepository from '../../repositories/product.repository'

beforeAll(async () => {
    await sequelizeService.initTestDB()
})

afterAll(async () => {
    await sequelizeService.close()
})
describe('Product Service', () => {
    it('create a new product', async () => {
        const shop = await Shop.create({
            name: 'Test shop',
            email: 'test_shop@gmail.com',
        })

        const productData = await ProductService.create('Earphone', {
            name: 'Jabra Elite 75',
            description: 'A very good product',
            price: '12',
            type: 'Earphone',
            thumbnail: '',
            shopId: shop.id,
            attributes: {
                brand: 'Jabra',
                size: 'M',
                material: 'Vinyl',
            },
        })

        // Assert
        // Check if the product is created in the Product table
        const createdProduct = await Product.findOne({
            where: { name: productData.name },
        })
        expect(createdProduct).toBeDefined()
        expect(createdProduct.name).toBe(productData.name)
        expect(createdProduct.description).toBe(productData.description)
        expect(createdProduct.price).toBe(parseFloat(productData.price))
        expect(createdProduct.type).toBe(productData.type)
        expect(createdProduct.slug).toBe(slugify(productData.name))
        expect(createdProduct.shopId).toBe(shop.id)

        // Check if the earphone attributes are created in the Earphone table
        const createdEarphone = await Earphone.findOne({
            productId: createdProduct.id,
        })
        expect(createdEarphone).toBeDefined()
        expect(createdEarphone.brand).toBe('Jabra')
        expect(createdEarphone.size).toBe('M')
        expect(createdEarphone.material).toBe('Vinyl')

        // Expect new records will be created inside test database too
    })
})