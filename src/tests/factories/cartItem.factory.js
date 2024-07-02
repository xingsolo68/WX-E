import { faker } from '@faker-js/faker'
import { CartItem } from '../../models/CartItem' // Adjust the import path as needed
import { CartFactory } from './cart.factory'
import { ProductFactory } from './product.factory'

export class CartItemFactory {
    static async create(overrideFields = {}) {
        const cart = await CartFactory.create()
        const product = await ProductFactory.create()

        const defaultFields = {
            cartId: cart.id,
            productId: product.id,
            quantity: faker.number.int({ min: 1, max: 10 }),
            // Add any other default fields for CartItem if needed
        }

        const cartItemData = { ...defaultFields, ...overrideFields }
        const cartItem = await CartItem.create(cartItemData)

        return cartItem
    }

    static async createMany(count, overrideFields = {}) {
        const cartItems = []
        for (let i = 0; i < count; i++) {
            const cartItem = await this.create(overrideFields)
            cartItems.push(cartItem)
        }
        return cartItems
    }
}
