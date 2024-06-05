import { afterAll, beforeAll, afterEach } from 'vitest'
import sequelizeService from '../services/sequelize.service'
import { Shop, Product } from '../models'

beforeAll(async () => {
    try {
        await sequelizeService.initTestDB()
    } catch (error) {
        throw error // Ensure the tests fail if the database initialization fails
    }
})

afterAll(async () => {
    await sequelizeService.close()
})
