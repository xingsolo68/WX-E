import { Discount } from '../models'

export class DiscountRepository {
    static async findAllDiscountCode({ filter, select }) {
        const discount = Discount.findAll({
            where: { ...filter },
            attributes: [...select],
        })
    }
}
