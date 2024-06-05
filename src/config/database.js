import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

const commonConfig = {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    define: {
        timestamps: true,
    },
}

const development = {
    ...commonConfig,
    database: process.env.DB_NAME,
    dialectOptions: {
        bigNumberStrings: true,
    },
}

const test = {
    ...commonConfig,
    database: process.env.DB_TEST_NAME,
    dialectOptions: {
        bigNumberStrings: true,
    },
}

export default { development, test }
