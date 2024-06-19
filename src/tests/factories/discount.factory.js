import { faker } from '@faker-js/faker'
import Discount from '../../models/Discount'
import { ShopFactory } from './shop.factory'

export class DiscountFactory {
    static async create(overridedFields = {}) {
        const shop = await ShopFactory.create()

        const defaultFields = {
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            type: 'fixed_amount',
            value: faker.number.int({ min: 10, max: 100 }),
            maxValue: faker.number.int({ min: 100, max: 500 }),
            code: faker.random.alphaNumeric(8),
            startDate: faker.date.soon(),
            endDate: faker.date.future(),
            maxUses: faker.number.int({ min: 1, max: 10 }),
            useCount: 0,
            userUses: [],
            maxUsesPerUser: faker.number.int({ min: 1, max: 5 }),
            minOrderValue: faker.number.int({ min: 50, max: 200 }),
            isActive: true,
            appliesTo: 'all',
            shopId: shop.id,
        }

        const discountData = { ...defaultFields, ...overridedFields }
        const discount = await Discount.create(discountData)
        return discount
    }
}
