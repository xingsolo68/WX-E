import express from 'express'
import fs from 'fs'
import bodyParser from 'body-parser'
import globalErrorHandler from '../middlewares/errorHandler.middleware'
import { userRoutes, addressRoutes, authRoutes } from '../routes'
/*
  body-parser: Parse incoming request bodies in a middleware before your handlers, 
  available under the req.body property.
*/

let server
const expressService = {
    init: async () => {
        try {
            server = express()
            server.use(bodyParser.json())

            const router = express.Router()
            router.get('/healthcheck', (req, res) => res.status(200).send('ok'))
            router.use('/auth', authRoutes)
            router.use('/users', userRoutes)
            router.use('/address', addressRoutes)

            server.use('/api', router)

            server.use(globalErrorHandler)
            server.listen(process.env.SERVER_PORT)
            console.log(
                '[EXPRESS] Express initialized at port ' +
                    process.env.SERVER_PORT
            )
        } catch (error) {
            console.log('[EXPRESS] Error during express service initialization')
            throw error
        }
    },
}

export default expressService
