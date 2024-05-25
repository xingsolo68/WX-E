import jwt from 'jsonwebtoken'
import moment from 'moment'
import { logger } from '../helpers/logger'
import { cloneDeep } from 'lodash'
import { InternalServerError, UnauthorizedError } from '../utils/ApiError'

let jwtidCounter = 0
let blacklist = []

const JwtService = {
    jwtSign: (_payload) => {
        try {
            if (process.env.SERVER_JWT !== 'true')
                throw new Error('[JWT] Fastify JWT flag is not setted')

            logger.info('[JWT] Generating JWT sign')

            const payload = cloneDeep(_payload)
            jwtidCounter = jwtidCounter + 1
            return jwt.sign({ payload }, process.env.SERVER_JWT_SECRET, {
                expiresIn: Number(process.env.SERVER_JWT_TIMEOUT),
                jwtid: jwtidCounter + '',
            })
        } catch (error) {
            logger.error('[JWT] Error during JWT sign')
            throw error
        }
    },

    jwtGetToken: (request) => {
        try {
            if (process.env.SERVER_JWT !== 'true')
                throw new InternalServerError('[JWT] JWT flag is not setted')
            if (
                !request.headers.authorization ||
                request.headers.authorization.split(' ')[0] !== 'Bearer'
            )
                throw new UnauthorizedError('[JWT] JWT token not provided')

            return request.headers.authorization.split(' ')[1]
        } catch (error) {
            logger.error('[JWT] Error getting JWT token')
            throw error
        }
    },

    jwtVerify: (token) => {
        try {
            if (process.env.SERVER_JWT !== 'true')
                throw new InternalServerError('[JWT] JWT flag is not setted')

            return jwt.verify(
                token,
                process.env.SERVER_JWT_PUBLIC,
                (err, decoded) => {
                    blacklist.forEach((element) => {
                        if (
                            element.jti === decoded.jti &&
                            element.iat === decoded.iat &&
                            element.exp === decoded.exp
                        )
                            throw err
                    })

                    logger.log(decoded)
                    if (err != null) throw err
                    return decoded.payload
                }
            )
        } catch (error) {
            logger.log('[JWT] Error getting JWT token')
            throw error
        }
    },

    jwtBlacklistToken: (token) => {
        try {
            while (
                blacklist.length &&
                moment().diff('1970-01-01 00:00:00Z', 'seconds') >
                    blacklist[0].exp
            ) {
                logger.log(
                    `[JWT] Removing from blacklist timed out JWT with id ${blacklist[0].jti}`
                )
                blacklist.shift()
            }
            const { jti, exp, iat } = jwt.decode(token)
            logger.log(`[JWT] Adding JWT ${token} with id ${jti} to blacklist`)
            blacklist.push({ jti, exp, iat })
        } catch (error) {
            logger.log('[JWT] Error blacklisting fastify JWT token')
            throw error
        }
    },
}

export default JwtService
