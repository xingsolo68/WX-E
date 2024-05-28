import { describe, it, expect, afterAll, beforeEach, beforeAll } from 'vitest'
import ProductRepository from '../../repositories/product.repository'
import sequelizeService from '../../services/sequelize.service'
import { Shop } from '../../models'
import { ProductFactory } from '../factories/product.factory'

beforeAll(async () => {
    await sequelizeService.initTestDB()
})

afterAll(async () => {
    await sequelizeService.close()
})

describe('Product Repository', async () => {
    let testShop

    beforeEach(async () => {
        testShop = await Shop.create({
            name: 'Test shop',
            email: 'test_shop@gmail.com',
        })
    })

    // After all tests in the Product Repository suite
    describe('getDraftProductForShop', () => {
        it('should return all the draft products', async () => {
            const product = await ProductFactory.create('Earphone', {
                shopId: testShop.id,
            })
            await ProductFactory.create('Earphone', {
                isDraft: false,
            })

            const draftProducts =
                await ProductRepository.getDraftProductForShop(testShop.id)

            expect(draftProducts).toHaveLength(1)
            const [retrievedProduct] = draftProducts

            expect(retrievedProduct.name).toBe(retrievedProduct.name)
            expect(retrievedProduct.price).toBe(retrievedProduct.price)
            expect(retrievedProduct.description).toBe(
                retrievedProduct.description
            )
        })
    })
})
