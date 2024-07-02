// CartFactory.js
import { faker } from '@faker-js/faker'
import { Cart } from '../../models/Cart' // Adjust the import path as needed
import { UserFactory } from './user.factory' // Assuming you have a UserFactory

export class CartFactory {
    static async create(overrideFields = {}) {
        const user = await UserFactory.create()

        const defaultFields = {
            userId: user.id,
        }

        const cartData = { ...defaultFields, ...overrideFields }
        const cart = await Cart.create(cartData)

        return cart
    }
}
