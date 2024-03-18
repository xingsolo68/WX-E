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

            server.use('/auth', authRoutes)
            server.use('/users', userRoutes)
            server.use('address', addressRoutes)

            server.use(bodyParser.json())
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
