import { describe, it, expect, afterEach } from 'vitest'
import supertest from 'supertest'
import expressService from '../../services/express.service'
import { Shop, Product, Earphone } from '../../models'
import { ProductFactory } from '../factories/product.factory'

afterEach(async () => {
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
            email: 'test.shop@gmail.com',
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
            email: 'test.shop@gmail.com',
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
