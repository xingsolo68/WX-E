import { describe, beforeEach, expect, afterAll, it, vi } from 'vitest'
import { CartService } from '../../services/cart.service'
import { BadRequestError, NotFoundError } from '../../errors'
import { ShopFactory, ProductFactory, UserFactory } from '../factories'
import sequelizeService from '../../services/sequelize.service'

describe('Cart service', () => {
    let testUser, testProduct, testShop

    beforeEach(async () => {
        await sequelizeService.clean()
        testUser = await UserFactory.create()
        testShop = await ShopFactory.create()
        testProduct = await ProductFactory.create('Earphone', {
            shopId: testShop.id,
            isPublished: true,
        })
    })

    afterAll(async () => {
        await sequelizeService.clean()
    })

    describe('addToCart', () => {
        it('should add a new product to the cart', async () => {
            const result = await CartService.addToCart({
                userId: testUser.id,
                productId: testProduct.id,
                quantity: 2,
            })

            expect(result.cart).toBeDefined()
            expect(result.cartItem).toBeDefined()
            expect(result.cartItem.productId).toBe(testProduct.id)
            expect(result.cartItem.quantity).toBe(2)
        })

        it('should increase quantity if product already in cart', async () => {
            // First, add the product to the cart
            await CartService.addToCart({
                userId: testUser.id,
                productId: testProduct.id,
                quantity: 1,
            })

            // Then, add the same product again
            const result = await CartService.addToCart({
                userId: testUser.id,
                productId: testProduct.id,
                quantity: 2,
            })

            expect(result.cartItem.quantity).toBe(3)
        })

        it('should throw an error if product does not exist', async () => {
            await expect(
                CartService.addToCart({
                    userId: testUser.id,
                    productId: 9999, // non-existent product id
                    quantity: 1,
                })
            ).rejects.toThrow(NotFoundError)
        })

        it('should throw an error if quantity is less than 1', async () => {
            await expect(
                CartService.addToCart({
                    userId: testUser.id,
                    productId: testProduct.id,
                    quantity: 0,
                })
            ).rejects.toThrow(BadRequestError)
        })

        it('should create a new cart if user does not have one', async () => {
            const result = await CartService.addToCart({
                userId: testUser.id,
                productId: testProduct.id,
                quantity: 1,
            })

            expect(result.cart).toBeDefined()
            expect(result.cart.userId).toBe(testUser.id)
        })

        it('should use existing cart if user already has one', async () => {
            // First, add a product to create a cart
            const firstResult = await CartService.addToCart({
                userId: testUser.id,
                productId: testProduct.id,
                quantity: 1,
            })

            // Then, add another product
            const secondProduct = await ProductFactory.create('Headphone', {
                shopId: testShop.id,
                isPublished: true,
            })
            const secondResult = await CartService.addToCart({
                userId: testUser.id,
                productId: secondProduct.id,
                quantity: 1,
            })

            expect(secondResult.cart.id).toBe(firstResult.cart.id)
        })
    })
})
