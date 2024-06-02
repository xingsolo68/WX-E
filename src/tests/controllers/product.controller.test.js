import { describe, it, expect, afterAll, beforeAll, test } from 'vitest'
import sequelizeService from '../../services/sequelize.service'
import supertest from 'supertest'
import expressService from '../../services/express.service'
import { Shop } from '../../models'
import { ProductFactory } from '../factories/product.factory'

beforeAll(async () => {
    await sequelizeService.initTestDB()
})

afterAll(async () => {
    await sequelizeService.close()
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

        const response = await supertest(expressService.getServer()).get(
            '/api/products/draft'
        )
        expect(response.body[0].name).toBe(product.name)
        expect(response.body[0].price).toBe(product.price)
        expect(response.body[0].id).toBe(product.id)
        expect(response.body[0].type).toBe(product.type)
    })
})
