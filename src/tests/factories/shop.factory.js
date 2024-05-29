import { faker } from '@faker-js/faker'
import bcrypt from 'bcryptjs'
import Shop from '../../models/Shop' // Adjust the path as needed

export class ShopFactory {
    static async create(overridedFields = {}) {
        const defaultFields = {
            email: faker.internet.email(),
            password: faker.internet.password(),
            name: faker.company.companyName(),
            isVerify: false,
        }

        // Merge default fields with any overridden fields
        const shopData = { ...defaultFields, ...overridedFields }

        // Hash the password
        const hashedPassword = await bcrypt.hash(shopData.password, 8)

        // Create the shop instance
        const shop = await Shop.create({
            email: shopData.email,
            password_hash: hashedPassword,
            name: shopData.name,
            isVerify: shopData.isVerify,
        })

        return shop
    }
}
