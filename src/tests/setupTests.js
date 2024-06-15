import { afterAll, beforeAll, afterEach } from 'vitest'
import sequelizeService from '../services/sequelize.service'
import { Shop, Product, Inventory, Earphone, Discount } from '../models'

beforeAll(async () => {
    try {
        await sequelizeService.initTestDB()
    } catch (error) {
        throw error // Ensure the tests fail if the database initialization fails
    }
})

afterAll(async () => {
    try {
        await sequelizeService.close()
    } catch (error) {
        throw error // Ensure the tests fail if the database initialization fails
    }
})
