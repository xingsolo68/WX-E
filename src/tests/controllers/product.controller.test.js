import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import supertest from 'supertest'
import expressService from '../../services/express.service'
import { Shop, Product, Earphone } from '../../models'
import { ProductFactory } from '../factories/product.factory'

beforeEach(async () => {
    await Earphone.truncate({ cascade: true, restartIdentity: true })
    await Product.truncate({ cascade: true, restartIdentity: true })
    await Shop.truncate({ cascade: true, restartIdentity: true })
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
            })

        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            id: 1,
            name: 'Test Product',
            price: 100,
            thumbnail: 'test.jpg',
            description: 'Test Description',
            type: 'Earphone',
        })
    })
})

describe('(GET) /api/products/draft', () => {
    it('should return all the draft products from shop', async () => {
        const testShop = await Shop.create({
            name: 'Test shop',
            email: 'test.shop1@gmail.com',
        })

        const product = await ProductFactory.create('Earphone', {
            shopId: testShop.id,
            isDraft: true,
        })

        const response = await supertest(expressService.getServer())
            .get('/api/products/draft')
            .set('shop-id', testShop.id)
        expect(response.body[0].name).toBe(product.name)
        expect(response.body[0].price).toBe(product.price)
        expect(response.body[0].id).toBe(product.id)
        expect(response.body[0].type).toBe(product.type)
    })
})

describe('(GET) /api/products/published', () => {
    it('should return all the published products from shop', async () => {
        const testShop = await Shop.create({
            name: 'Test shop',
            email: 'test.shop2@gmail.com',
        })

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

describe('(GET) /api/products/publised/all', () => {
    it('should return all the publised products from all shop', async () => {
        const testShop = await Shop.create({
            name: 'Test shop',
            email: 'test.shop2@gmail.com',
        })

        await ProductFactory.create('Earphone', {
            isDraft: true,
        })

        const product = await ProductFactory.create('Earphone', {
            isPublished: true,
        })

        const response = await supertest(expressService.getServer())
            .get('/api/products/published/all')
            .set('shop-id', testShop.id)

        expect(response.status).toBe(200)
        expect(response.body[0].name).toBe(product.name)
        expect(response.body[0].price).toBe(product.price)
        expect(response.body[0].id).toBe(product.id)
        expect(response.body[0].type).toBe(product.type)
    })
})

describe('(PATCH) /api/products/:productId/published', () => {
    it('should update the product to published', async () => {
        const testShop = await Shop.create({
            name: 'Test shop',
            email: 'test.shop2@gmail.com',
        })

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
        const testShop = await Shop.create({
            name: 'Test shop',
            email: 'test.shop2@gmail.com',
        })

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
