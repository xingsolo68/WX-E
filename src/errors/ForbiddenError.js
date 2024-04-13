import { errorMessages, errorCodes, statusCodes } from './constants'
import { CustomError } from './CustomError'
/**
 * ForbiddenError
 *
 * @class ForbiddenError
 * @extends {CustomError}
 */
export class ForbiddenError extends CustomError {
    /**
     * constructor
     * @param  {string} message - custom error message
     */
    constructor(message) {
        super(
            message || errorMessages.FORBIDDEN,
            errorCodes.FORBIDDEN,
            statusCodes.FORBIDDEN
        )
    }
}
