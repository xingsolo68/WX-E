import { describe, beforeEach, afterEach, expect, it, vi } from 'vitest'
import { CartService } from '../../services/cart.service'
import { Cart, CartItem, Product, User } from '../../models'
import { ShopFactory, ProductFactory, UserFactory } from '../factories'
import sequelizeService from '../../services/sequelize.service'

describe('CartService', () => {
    let testUser, testProduct, testShop

    beforeEach(async () => {
        testUser = await UserFactory.create()
        testShop = await ShopFactory.create()
        testProduct = await ProductFactory.create('Earphone', {
            shopId: testShop.id,
            isPublished: true,
        })
    })

    afterEach(async () => {
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
            expect(result.cart.Products).toHaveLength(1)
            expect(result.cart.Products[0].id).toBe(testProduct.id)
            expect(result.cart.Products[0].cartItems.quantity).toBe(2)
        })

        it('should increase quantity if product already in cart', async () => {
            await CartService.addToCart({
                userId: testUser.id,
                productId: testProduct.id,
                quantity: 1,
            })

            const result = await CartService.addToCart({
                userId: testUser.id,
                productId: testProduct.id,
                quantity: 2,
            })

            expect(result.cart.Products[0].cartItems.quantity).toBe(3)
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
            const firstResult = await CartService.addToCart({
                userId: testUser.id,
                productId: testProduct.id,
                quantity: 1,
            })

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
            expect(secondResult.cart.Products).toHaveLength(2)
        })
    })

    describe('updateCartItemQuantity', () => {
        it('should update the quantity of an existing cart item', async () => {
            await CartService.addToCart({
                userId: testUser.id,
                productId: testProduct.id,
                quantity: 2,
            })

            const result = await CartService.updateCartItemQuantity({
                userId: testUser.id,
                productId: testProduct.id,
                quantity: 5,
            })

            expect(result.cart.Products[0].cartItems.quantity).toBe(5)
        })

        it('should remove the cart item if quantity is set to 0', async () => {
            await CartService.addToCart({
                userId: testUser.id,
                productId: testProduct.id,
                quantity: 2,
            })

            const result = await CartService.updateCartItemQuantity({
                userId: testUser.id,
                productId: testProduct.id,
                quantity: 0,
            })

            expect(result.cart.Products).toHaveLength(0)
        })

        it('should throw an error if cart is not found', async () => {
            await expect(
                CartService.updateCartItemQuantity({
                    userId: 999, // non-existent user
                    productId: testProduct.id,
                    quantity: 1,
                })
            ).rejects.toThrow('Cart not found for this user')
        })

        it('should throw an error if product is not in the cart', async () => {
            await CartService.addToCart({
                userId: testUser.id,
                productId: testProduct.id,
                quantity: 1,
            })

            await expect(
                CartService.updateCartItemQuantity({
                    userId: testUser.id,
                    productId: 999, // non-existent product
                    quantity: 1,
                })
            ).rejects.toThrow('Product not found in the cart')
        })
    })

    describe('deleteUserCart', () => {
        it('should remove a specific item from the user cart', async () => {
            // First, add an item to the cart
            await CartService.addToCart({
                userId: testUser.id,
                productId: testProduct.id,
                quantity: 2,
            })

            // Now delete the item
            const result = await CartService.deleteUserCart({
                userId: testUser.id,
                productId: testProduct.id,
            })

            expect(result.cart).toBeDefined()
            expect(result.cart.Products).toHaveLength(0)
            expect(result.message).toBe('Item successfully removed from cart')
        })

        it('should not affect other items in the cart', async () => {
            // Add two items to the cart
            await CartService.addToCart({
                userId: testUser.id,
                productId: testProduct.id,
                quantity: 2,
            })

            const secondProduct = await ProductFactory.create('Headphone', {
                shopId: testShop.id,
                isPublished: true,
            })
            await CartService.addToCart({
                userId: testUser.id,
                productId: secondProduct.id,
                quantity: 1,
            })

            // Delete one item
            const result = await CartService.deleteUserCart({
                userId: testUser.id,
                productId: testProduct.id,
            })

            expect(result.cart.Products).toHaveLength(1)
            expect(result.cart.Products[0].id).toBe(secondProduct.id)
        })

        it('should throw an error if cart is not found', async () => {
            await expect(
                CartService.deleteUserCart({
                    userId: 999, // non-existent user
                    productId: testProduct.id,
                })
            ).rejects.toThrow('Cart not found for this user')
        })

        it('should throw an error if product is not in the cart', async () => {
            // First, create a cart for the user
            await CartService.addToCart({
                userId: testUser.id,
                productId: testProduct.id,
                quantity: 1,
            })

            await expect(
                CartService.deleteUserCart({
                    userId: testUser.id,
                    productId: 999, // non-existent product
                })
            ).rejects.toThrow('Product not found in the cart')
        })
    })
})
