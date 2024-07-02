// UserFactory.js
import { faker } from '@faker-js/faker'
import { User } from '../models' // Adjust the import path as needed

export class UserFactory {
    static async create(overrideFields = {}) {
        const defaultFields = {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: 'password123', // Default password for testing
        }

        const userData = { ...defaultFields, ...overrideFields }

        // Create the user
        const user = await User.create(userData)

        // Since password is virtual and not returned, we'll add it back for testing purposes
        user.password = userData.password

        return user
    }

    static async createMany(count, overrideFields = {}) {
        const users = []
        for (let i = 0; i < count; i++) {
            const user = await this.create(overrideFields)
            users.push(user)
        }
        return users
    }

    // Helper method to create a user with a verified email
    static async createVerified(overrideFields = {}) {
        const user = await this.create(overrideFields)
        user.emailVerifiedAt = new Date()
        await user.save()
        return user
    }

    // Helper method to create an admin user
    static async createAdmin(overrideFields = {}) {
        return this.create({ ...overrideFields, role: 'admin' })
    }
}
