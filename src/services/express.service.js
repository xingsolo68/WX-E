import express from 'express'
import fs from 'fs'
import bodyParser from 'body-parser'
import globalErrorHandler from '../middlewares/errorHandler.middleware'
import { userRoutes, addressRoutes, authRoutes } from '../routes'
import { logger } from '../helpers/logger'
/*
  body-parser: Parse incoming request bodies in a middleware before your handlers, 
  available under the req.body property.
*/

let server
const expressService = {
    init: async function () {
        try {
            const server = this.getServer()
            server.listen(process.env.SERVER_PORT)
            logger.info(
                '[EXPRESS] Express initialized at port ' +
                    process.env.SERVER_PORT
            )
        } catch (error) {
            logger.error(
                '[EXPRESS] Error during express service initialization'
            )
            throw error
        }
    },
    getServer: function () {
        server = express()
        server.use(bodyParser.json())

        const router = express.Router()
        router.get('/healthcheck', (req, res) => res.status(200).send('ok'))
        router.use('/auth', authRoutes)
        router.use('/users', userRoutes)
        router.use('/address', addressRoutes)

        server.use('/api', router)

        server.use(globalErrorHandler)
        return server
    },
}

export default expressService
