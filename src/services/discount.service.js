import { Op } from 'sequelize'
import { BadRequestError, NotFoundError } from '../errors/BadRequestError'
import { Product } from '../models'
import Discount from '../models/Discount'
import ProductRepository from '../repositories/product.repository'
import { DiscountRepository } from '../repositories/discount.repository'
import { NotFoundError } from '../errors'

export class DiscountService {
    static async createDiscountCode(payload) {
        const {
            code,
            startDate,
            endDate,
            isActive,
            shopId,
            minOrderValue,
            productIds,
            appliesTo,
            name,
            description,
            type,
            value,
            maxValue,
            maxUses,
            useCount,
            maxUsesPerUser,
        } = payload

        if (
            new Date() < new Date(startDate) ||
            new Date() > new Date(endDate)
        ) {
            console.log('=====================')
            throw new BadRequestError('Discount code has expired!')
        }

        if (new Date(endDate) <= new Date(startDate)) {
            throw new BadRequestError('Start date must be before end date ')
        }

        const foundDiscount = await Discount.findOne({
            where: {
                code,
                shopId,
            },
        })

        if (foundDiscount) {
            throw new BadRequestError('Discount code already exists')
        }

        const discount = await Discount.create({
            code,
            startDate,
            endDate,
            isActive,
            minOrderValue,
            productIds,
            appliesTo,
            name,
            description,
            type,
            value,
            maxValue,
            maxUses,
            useCount,
            maxUsesPerUser,
            shopId,
        })

        return discount
    }

    static async updateDiscountCode(code, shopId, updatedData) {
        const foundDiscount = await Discount.findOne({
            where: { code, shopId },
        })

        if (!foundDiscount) {
            throw new BadRequestError('Discount code not exist')
        }

        await foundDiscount.update({ ...updatedData })
        await foundDiscount.save()
    }

    static async getAllDiscountCodeWithProducts(code, shopId, userId) {
        const foundDiscount = await Discount.findOne({
            where: {
                code,
                shopId,
                isActive: false,
            },
            include: [
                {
                    model: Product,
                },
            ],
        })

        if (!foundDiscount || !foundDiscount.isActive) {
            throw new NotFoundError('Discount not exist!')
        }

        const { appliesTo } = foundDiscount
        let products

        if (appliesTo === 'all') {
            products = await ProductRepository.queryProducts({
                filter: {
                    isPublished: true,
                    shopId,
                },
                select: ['name'],
            })
        } else {
            const productIds = foundDiscount.Products.map(
                (product) => product.id
            )
            products = await ProductRepository.queryProducts({
                filter: {
                    id: {
                        [Op.in]: productIds,
                    },
                    isPublished: true,
                    shopId,
                },
                select: ['name'],
            })
        }

        return products
    }

    static async getAllDiscountCodeByShop(shopId) {
        const discounts = await DiscountRepository.findAllDiscountCode({
            filter: { shopId },
            select: ['name', 'code', 'type', 'startDate', 'maxValue'],
        })

        return discounts
    }

    static async getDiscountAmount({ code, userId, shopId, products }) {
        const foundDiscount = await Discount.findOne({
            where: {
                code,
                shopId,
            },
        })

        if (!foundDiscount) throw new NotFoundError('Discount does not exist')

        const {
            isActive,
            maxUses,
            startDate,
            endDate,
            minOrderValue,
            type,
            value,
        } = foundDiscount

        if (!isActive) {
            throw new BadRequestError('Discount is not active')
        }

        if (
            new Date() < new Date(startDate) ||
            new Date() > new Date(endDate)
        ) {
            throw new NotFoundError('Discount has been expired')
        }

        const totalOrderValue = products.reduce(
            (acc, product) => acc + product.quantity * product.price,
            0
        )

        if (totalOrderValue < minOrderValue) {
            console.log(totalOrderValue, minOrderValue)
            throw new BadRequestError(
                'The orders has not reached min order value'
            )
        }

        const discountAmount =
            type === 'fixed_amount' ? value : totalOrderValue * (value / 100)

        return discountAmount
    }

    static async deleteDiscountCode({ code, shopId }) {
        const foundDiscount = await Discount.findOne({
            where: {
                shopId,
                code,
            },
        })

        if (!foundDiscount) {
            throw new NotFoundError('Discount does not exist')
        }

        return await foundDiscount.destroy()
    }

    static async cancelDiscountCode({ code, shopId }) {
        const foundDiscount = await Discount.findOne({
            where: {
                shopId,
                code,
            },
        })

        if (!foundDiscount) {
            throw new NotFoundError('Discount does not exist')
        }

        const result = await foundDiscount.update({
            isActive: false,
        })

        return result
    }
}
