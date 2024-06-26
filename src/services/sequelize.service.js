import { Sequelize } from 'sequelize'
import databaseConfig from '../config/database'
import fs from 'fs'

const modelFiles = fs
    .readdirSync(__dirname + '/../models/')
    .filter((file) => file.endsWith('.js'))

const sequelizeService = {
    init: async () => {
        try {
            let connection = new Sequelize(databaseConfig)

            /*
        Loading models automatically
      */

            for (const file of modelFiles) {
                if (file.startsWith('index.js')) {
                    continue
                }
                const model = await import(`../models/${file}`)
                model.default.init(connection)
            }

            modelFiles.map(async (file) => {
                if (file.startsWith('index.js')) {
                    return
                }
                const model = await import(`../models/${file}`)
                model.default.associate &&
                    model.default.associate(connection.models)
            })

            console.log('[SEQUELIZE] Database service initialized')
            await connection.sync()
        } catch (error) {
            console.log(
                '[SEQUELIZE] Error during database service initialization'
            )
            throw error
        }
    },
}

export default sequelizeService
