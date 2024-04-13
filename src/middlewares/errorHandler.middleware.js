import { Request, Response, NextFunction } from 'express'
import { IsApiError, ApiError } from '../utils/ApiError'
import { statusCodes, errorMessages } from '../errors'
const currentEnv = process.env.NODE_ENV || 'development'
/**
 * Global error handler for all routes
 * @param {ApiError} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export default (err, _req, res, next) => {
    if (res.headersSent) return next(err)
    if (IsApiError(err)) return res.status(err.statusCode).send(err.message)
    if (currentEnv === 'development') {
        console.log(err)
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(err.message)
    }
    console.log(err)
    return res
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .send(errorMessages.INTERNAL_SERVER_ERROR)
}
