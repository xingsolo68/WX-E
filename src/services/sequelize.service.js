import { Sequelize } from 'sequelize'
import config from '../config/database'
import { logger } from '../helpers/logger'

let connection

const sequelizeService = {
    loadModels: async function () {
        const models = await import(`../models`)
        for (const modelName in models) {
            const model = models[modelName]
            model.init(connection)
        }

        for (const modelName in models) {
            const model = models[modelName]
            model.associate && (await model.associate(connection.models))
        }
    },

    init: async function () {
        try {
            connection = new Sequelize(config.development)
            await this.loadModels()

            logger.info('[SEQUELIZE] Database service initialized')
            await connection.sync({ logging: false })
        } catch (error) {
            logger.warn(
                '[SEQUELIZE] Error during database service initialization'
            )
            throw error
        }
    },

    initTestDB: async function () {
        try {
            connection = new Sequelize(config.test)
            await this.loadModels()

            logger.info('[SEQUELIZE] Test database service initialized')
            await connection.sync()
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

    clean: async function () {
        try {
            await connection.truncate({ cascade: true, restartIdentity: true })
            logger.info('[SEQUELIZE] Database connection closed')
        } catch (error) {
            logger.warn('[SEQUELIZE] Error during database connection clear')
            throw error
        }
    },
}

export default sequelizeService
