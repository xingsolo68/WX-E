import {
    describe,
    it,
    expect,
    afterAll,
    beforeEach,
    beforeAll,
    test,
    afterEach,
} from 'vitest'
import ProductRepository from '../../repositories/product.repository'
import sequelizeService from '../../services/sequelize.service'
import { Shop, Product } from '../../models'
import { ProductFactory } from '../factories/product.factory'

beforeAll(async () => {
    await sequelizeService.initTestDB()
})

afterAll(async () => {
    await sequelizeService.close()
})

describe('Product Repository', async () => {
    // After all tests in the Product Repository suite
    let testShop
    beforeEach(async () => {
        testShop = await Shop.create({
            name: 'Test shop',
            email: 'testShop@gmail.com',
        })
    })

    afterEach(async () => {
        await testShop.destroy()
    })
    describe('getDraftProductForShop', () => {
        it('should return all the draft products', async () => {
            const product = await ProductFactory.create('Earphone', {
                shopId: testShop.id,
                isDraft: true,
            })
            await ProductFactory.create('Earphone', {
                shopId: testShop.id,
                isDraft: false,
            })

            const draftProducts =
                await ProductRepository.getDraftProductsForShop(testShop.id)

            expect(draftProducts).toHaveLength(1)
            const [retrievedProduct] = draftProducts

            expect(retrievedProduct.name).toBe(product.name)
            expect(retrievedProduct.description).toBe(product.description)
        })
    })
    describe('getPublishedProductsForShop', async () => {
        it('should return all the published products', async () => {
            const product = await ProductFactory.create('Earphone', {
                shopId: testShop.id,
                isPublished: true,
            })
            await ProductFactory.create('Earphone', {
                shopId: testShop.id,
                isPublished: false,
            })

            const publishedProducts =
                await ProductRepository.getPublishedProductsForShop(testShop.id)

            expect(publishedProducts).toHaveLength(1)
            const [retrievedProduct] = publishedProducts

            expect(retrievedProduct.name).toBe(product.name)
            expect(retrievedProduct.description).toBe(product.description)
        })
    })
})
