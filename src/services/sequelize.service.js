import { Sequelize } from 'sequelize'
import { databaseConfig, testDatabaseConfig } from '../config/database'
import { logger } from '../helpers/logger'

let connection

const sequelizeService = {
    loadModels: async function () {
        // for (const file of modelFiles) {
        // if (file.startsWith('index.js')) {
        //     continue
        // }
        const models = await import(`../models`)
        for (const modelName in models) {
            const model = models[modelName]
            model.init(connection)
        }

        for (const modelName in models) {
            const model = models[modelName]
            model.associate && model.associate(connection.models)
        }
    },

    init: async function () {
        try {
            connection = new Sequelize(databaseConfig)
            await this.loadModels()

            logger.info('[SEQUELIZE] Database service initialized')
            await connection.sync()
        } catch (error) {
            logger.warn(
                '[SEQUELIZE] Error during database service initialization'
            )
            throw error
        }
    },

    initTestDB: async function () {
        try {
            connection = new Sequelize(testDatabaseConfig)
            await this.loadModels()

            logger.info('[SEQUELIZE] Test database service initialized')
            await connection.sync({ force: true })
        } catch (error) {
            logger.warn(
                '[SEQUELIZE] Error during test database service initialization'
            )
            console.log('error', error)
            // throw error
        }
    },

    close: async function () {
        try {
            await connection.close()
            logger.info('[SEQUELIZE] Database connection closed')
        } catch (error) {
            logger.warn('[SEQUELIZE] Error during database connection closure')
            throw error
        }
    },
}

export default sequelizeService
