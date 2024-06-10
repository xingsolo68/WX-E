import { BadRequestError } from '../errors/BadRequestError'
import Discount from '../models/Discount'

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
            usesCount,
            maxUsesPerUser,
        } = payload

        if (
            new Date() < new Date(startDate) ||
            new Date() > new Date(endDate)
        ) {
            throw new BadRequestError('Discount code has expired!')
        }

        const foundDiscount = await Discount.findOne({
            where: {
                code,
                shopId,
            },
        })

        if (!foundDiscount) {
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
            usesCount,
            maxUsesPerUser,
        })

        return discount
    }
}
