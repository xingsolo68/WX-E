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

export const databaseConfig = {
    ...commonConfig,
    database: process.env.DB_NAME,
}

export const testDatabaseConfig = {
    ...commonConfig,
    database: process.env.DB_TEST_NAME,
}
