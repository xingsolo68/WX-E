import { errorMessages, errorCodes, statusCodes } from './constants'
import { CustomError } from './CustomError'
/**
 * UnauthorizedError
 *
 * @class UnauthorizedError
 * @extends {CustomError}
 */
export class UnauthorizedError extends CustomError {
    /**
     * constructor
     * @param  {string} message - custom error message
     */
    constructor(message) {
        super(
            message || errorMessages.UNAUTHORIZED,
            errorCodes.UNAUTHORIZED,
            statusCodes.UNAUTHORIZED
        )
    }
}
