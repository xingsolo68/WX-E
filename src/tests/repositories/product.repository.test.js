import { describe, it, expect, afterAll, beforeAll } from 'vitest'
import ProductRepository from '../../repositories/product.repository'
import sequelizeService from '../../services/sequelize.service'
import { Product, Earphone } from '../../models'
import { ProductFactory } from '../factories/product.factory'
import { Op } from 'sequelize'
import { ShopFactory } from '../factories/shop.factory'

describe('Product Repository', async () => {
    let testShop
    // After all tests in the Product Repository suite
    beforeAll(async () => {
        testShop = await ShopFactory.create()
    })

    afterAll(async () => {
        await sequelizeService.clean()
    })

    describe('fetchAllPublishProducts', async () => {
        it('should return all publish products from all shops', async () => {
            await ProductFactory.create('Earphone', {
                isPublished: true,
            })

            const products = await ProductRepository.fetchAllPublishProducts()
            expect(products.length).toBe(1)
        })
    })

    describe('getDraftProductForShop', () => {
        it('should return all the draft products', async () => {
            const product = await ProductFactory.create('Earphone', {
                isDraft: true,
                shopId: testShop.id,
            })

            const draftProducts = await ProductRepository.fetchDraftProducts(
                testShop.id
            )

            expect(draftProducts).toHaveLength(1)
            const [retrievedProduct] = draftProducts

            expect(retrievedProduct.name).toBe(product.name)
            expect(retrievedProduct.description).toBe(product.description)
        })
    })

    describe('getPublishedProductsForShop', async () => {
        it('should return all the published products', async () => {
            const product = await ProductFactory.create('Earphone', {
                isPublished: true,
                shopId: testShop.id,
            })

            const publishedProducts =
                await ProductRepository.fetchPublishedProducts(testShop.id)

            expect(publishedProducts).toHaveLength(1)
            const [retrievedProduct] = publishedProducts

            expect(retrievedProduct.name).toBe(product.name)
            expect(retrievedProduct.description).toBe(product.description)
        })
    })

    describe('publishProducts', () => {
        it('should publish multiple products for the shop', async () => {
            const product1 = await ProductFactory.create('Earphone', {
                shopId: testShop.id,
            })
            const product2 = await ProductFactory.create('Earphone', {
                shopId: testShop.id,
            })

            await ProductRepository.publishProducts(testShop.id, [
                product1.id,
                product2.id,
            ])

            const updated = await Product.findAll({
                where: {
                    id: {
                        [Op.in]: [product1.id, product2.id],
                    },
                },
            })

            // Validate that both products have been updated
            updated.forEach((product) => {
                expect(product.isDraft).toBe(false)
                expect(product.isPublished).toBe(true)
            })
        })

        it('should throw error if a product does not belong to the shop', async () => {
            const product1 = await ProductFactory.create('Earphone', {})
            const invalidProductId = 99999

            await expect(
                ProductRepository.publishProducts(testShop.id, [
                    product1.id,
                    invalidProductId,
                ])
            ).rejects.toThrow(
                'One or more products not found or could not be updated'
            )
        })
    })

    describe('unpublishProducts', () => {
        it('should unpublish multiple products for the shop', async () => {
            const product1 = await ProductFactory.create('Earphone', {
                shopId: testShop.id,
                isPublished: false,
            })
            const product2 = await ProductFactory.create('Earphone', {
                shopId: testShop.id,
                isPublished: false,
            })

            await ProductRepository.unpublishProducts(testShop.id, [
                product1.id,
                product2.id,
            ])

            const updated = await Product.findAll({
                where: {
                    id: {
                        [Op.in]: [product1.id, product2.id],
                    },
                },
            })

            // Validate that both products have been updated
            updated.forEach((product) => {
                expect(product.isDraft).toBe(true)
                expect(product.isPublished).toBe(false)
            })
        })
    })

    describe('updateProduct', async () => {
        it('should update the product', async () => {
            const product = await ProductFactory.create('Earphone', {
                shopId: testShop.id,
            })

            await ProductRepository.updateProductAndSubtype(
                { shopId: testShop.id, productId: product.id },
                {
                    name: 'Updated Product',
                    attributes: {
                        brand: 'Apple',
                        size: 'XL',
                        material: 'leather',
                    },
                }
            )

            const updatedProduct = await Product.findByPk(product.id)
            expect(updatedProduct.name).toBe('Updated Product')

            const updatedEarphone = await Earphone.findByPk(product.id)
            expect(updatedEarphone.brand).toBe('Apple')
            expect(updatedEarphone.size).toBe('XL')
            expect(updatedEarphone.material).toBe('leather')
        })

        it('should not  update the product not belong to shop', async () => {
            const product = await ProductFactory.create('Earphone', {})
            const invalidShopId = 9999

            expect(
                ProductRepository.updateProductAndSubtype(
                    { shopId: invalidShopId, productId: product.id },
                    {
                        name: 'Updated Product',
                        type: 'Earphone',
                    }
                )
            ).rejects.throw('Product not found or no changes made')
        })
    })
})
