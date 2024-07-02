import { Cart, CartItem, Product, sequelize } from '../models'

export class CartService {
    static async addToCart({ userId, productId, quantity = 1 }) {
        try {
            return await sequelize.transaction(async (t) => {
                // Find or create the cart
                const [cart, _] = await Cart.findOrCreate({
                    where: { userId },
                    defaults: { userId },
                    transaction: t,
                })

                // Find or create the cart item
                let [cartItem, itemCreated] = await CartItem.findOrCreate({
                    where: {
                        cartId: cart.id,
                        productId: productId,
                    },
                    defaults: {
                        cartId: cart.id,
                        productId: productId,
                        quantity: quantity,
                    },
                    transaction: t,
                })

                if (!itemCreated) {
                    // If the cart item already existed, increment its quantity
                    await cartItem.increment('quantity', {
                        by: quantity,
                        transaction: t,
                    })
                    // Reload the cart item to get the updated quantity
                    await cartItem.reload({ transaction: t })
                }

                // Fetch the updated cart with all its items
                const updatedCart = await Cart.findByPk(cart.id, {
                    include: [
                        {
                            model: CartItem,
                            include: [Product],
                        },
                    ],
                    transaction: t,
                })

                return { cart: updatedCart, cartItem }
            })
        } catch (error) {
            console.error('Error in addToCart:', error)
            throw error
        }
    }

    static async updateCartItemQuantity({ userId, productId, quantity }) {
        try {
            return await sequelize.transaction(async (t) => {
                // Find the user's cart
                const cart = await Cart.findOne({
                    where: { userId },
                    transaction: t,
                })

                if (!cart) {
                    throw new Error('Cart not found for this user')
                }

                // Find the cart item
                const cartItem = await CartItem.findOne({
                    where: {
                        cartId: cart.id,
                        productId: productId,
                    },
                    transaction: t,
                })

                if (!cartItem) {
                    throw new Error('Product not found in the cart')
                }

                // Update the quantity
                if (quantity > 0) {
                    cartItem.quantity = quantity
                    await cartItem.save({ transaction: t })
                } else {
                    // If quantity is 0 or negative, remove the item from the cart
                    await cartItem.destroy({ transaction: t })
                }

                // Fetch the updated cart with all its items
                const updatedCart = await Cart.findByPk(cart.id, {
                    include: [
                        {
                            model: CartItem,
                            include: [Product],
                        },
                    ],
                    transaction: t,
                })

                return {
                    cart: updatedCart,
                    cartItem: quantity > 0 ? cartItem : null,
                }
            })
        } catch (error) {
            console.error('Error in updateCartItemQuantity:', error)
            throw error
        }
    }
}
