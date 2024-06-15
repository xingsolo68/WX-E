import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import ProductService from '../../services/product.service'
import { Earphone, Inventory, Product, Shop } from '../../models'
import slugify from 'slugify'
import sequelizeService from '../../services/sequelize.service'

describe('Product Service', () => {
    afterAll(async () => {
        await sequelizeService.clean()
    })

    it('create a new product', async () => {
        const testShop = await Shop.create({
            name: 'Test shop',
            email: 'testShop@gmail.com',
        })
        const productData = await ProductService.create('Earphone', {
            name: 'Jabra Elite 75',
            description: 'A very good product',
            price: '12',
            type: 'Earphone',
            thumbnail: '',
            shopId: testShop.id,
            attributes: {
                brand: 'Jabra',
                size: 'M',
                material: 'Vinyl',
            },
            quantity: 123,
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
        expect(createdProduct.slug).toBe(
            slugify(productData.name, { lower: true })
        )
        expect(createdProduct.shopId).toBe(testShop.id)

        // Check if the earphone attributes are created in the Earphone table
        const createdEarphone = await Earphone.findOne({
            productId: createdProduct.id,
        })
        expect(createdEarphone).toBeDefined()
        expect(createdEarphone.brand).toBe('Jabra')
        expect(createdEarphone.size).toBe('M')
        expect(createdEarphone.material).toBe('Vinyl')

        const createdInventory = await Inventory.findByPk(createdProduct.id)
        expect(createdInventory).toBeDefined()
        expect(createdInventory.stock).toBe(123)

        // Expect new records will be created inside test database too
    })
})
