import {
    errorCodes,
    errorMessages,
    statusCodes,
    statusCodes,
} from './constants'

/**
 * CustomError
 *
 * The CustomError is a base class that allows you to create custom HTTP exceptions
 *
 * @class CustomError
 * @extends {Error}
 */
export class CustomError extends Error {
    /**
     * constructor
     * @param  {string} message - error message
     * @param  {string} code - error code
     * @param  {number} statusCode - error statusCode
     */
    constructor(
        message = errorMessages.INTERNAL_SERVER_ERROR,
        code = errorCodes.INTERNAL_SERVER_ERROR,
        statusCode = statusCodes.INTERNAL_SERVER_ERROR
    ) {
        super(message)
        Error.captureStackTrace(this, this.constructor)
        this.code = code
        this.statusCode = statusCode
        this.message = message
        this.isCustomError = true
    }
}
