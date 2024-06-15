import {
    describe,
    it,
    expect,
    afterAll,
    afterEach,
    beforeAll,
    beforeEach,
} from 'vitest'
import supertest from 'supertest'
import expressService from '../../services/express.service'
import { Product } from '../../models'
import { ProductFactory } from '../factories/product.factory'
import { ShopFactory } from '../factories/shop.factory'
import sequelizeService from '../../services/sequelize.service'

describe('ProductController', () => {
    let testShop
    beforeAll(async () => {
        testShop = await ShopFactory.create()
    })

    afterAll(async () => {
        await sequelizeService.clean()
    })

    describe('(POST) /api/product', () => {
        it('should create a product successfully', async () => {
            // Mock the ProductService.create method
            const response = await supertest(expressService.getServer())
                .post('/api/products')
                .send({
                    name: 'Jabra Elite 75',
                    description: 'A very good product',
                    price: '12',
                    type: 'Earphone',
                    thumbnail: '',
                    attributes: {
                        brand: 'Jabra',
                        size: 'M',
                        material: 'Vinyl',
                    },
                    isDraft: true,
                })
                .set('shop-id', testShop.id)

            expect(response.status).toBe(201)
            expect(response.body).toEqual(
                expect.objectContaining({
                    name: 'Jabra Elite 75',
                    price: 12,
                    description: 'A very good product',
                    type: 'Earphone',
                    thumbnail: '',
                })
            )
        })
    })

    describe('(GET) /api/products/draft', () => {
        it('should return all the draft products from shop', async () => {
            const product = await ProductFactory.create('Earphone', {
                shopId: testShop.id,
                isDraft: true,
            })

            const response = await supertest(expressService.getServer())
                .get('/api/products/draft')
                .set('shop-id', testShop.id)
            expect(response.body[1].name).toBe(product.name)
            expect(response.body[1].price).toBe(product.price)
            expect(response.body[1].id).toBe(product.id)
            expect(response.body[1].type).toBe(product.type)
        })
    })

    describe('(GET) /api/products/published', () => {
        it('should return all the published products from shop', async () => {
            await ProductFactory.create('Earphone', {
                shopId: testShop.id,
                isDraft: true,
            })

            const product = await ProductFactory.create('Earphone', {
                shopId: testShop.id,
                isPublished: true,
            })

            const response = await supertest(expressService.getServer())
                .get('/api/products/published')
                .set('shop-id', testShop.id)

            expect(response.body[0].name).toBe(product.name)
            expect(response.body[0].price).toBe(product.price)
            expect(response.body[0].id).toBe(product.id)
            expect(response.body[0].type).toBe(product.type)
        })
    })

    describe('(GET) /api/products/published/all', () => {
        it('should return all the published products from all shop', async () => {
            const shop = await ShopFactory.create({})

            await ProductFactory.create('Earphone', {
                isDraft: true,
                shopId: shop.id,
            })

            await ProductFactory.create('Earphone', {
                isPublished: true,
                shopId: shop.id,
            })

            const response = await supertest(expressService.getServer())
                .get('/api/products/published/all')
                .set('shop-id', shop.id)

            expect(response.status).toBe(200)
            expect(response.body.length).toBe(1)
        })
    })

    describe('(PATCH) /api/products/:productId/published', () => {
        it('should update the product to published', async () => {
            const product = await ProductFactory.create('Earphone', {
                isDraft: true,
                isPublished: false,
                shopId: testShop.id,
            })

            const response = await supertest(expressService.getServer())
                .patch(`/api/products/${product.id}/published`)
                .set('shop-id', testShop.id)

            const updatedProduct = await Product.findByPk(product.id)

            expect(response.status).toBe(200)
            expect(updatedProduct.isPublished).toBe(true)
        })
    })

    describe('(PATCH) /api/products/:productId/unpublished', () => {
        it('should update the product to unpublished', async () => {
            const product = await ProductFactory.create('Earphone', {
                isDraft: true,
                isPublished: true,
                shopId: testShop.id,
            })

            const response = await supertest(expressService.getServer())
                .patch(`/api/products/${product.id}/unpublished`)
                .set('shop-id', testShop.id)

            const updatedProduct = await Product.findByPk(product.id)

            expect(response.status).toBe(200)
            expect(updatedProduct.isPublished).toBe(false)
        })
    })
})
