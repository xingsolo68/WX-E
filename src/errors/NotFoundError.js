import { errorMessages, errorCodes, statusCodes } from './constants'
import { CustomError } from './CustomError'
/**
 * NotFoundError
 *
 * @class NotFoundError
 * @extends {CustomError}
 */
export class NotFoundError extends CustomError {
    /**
     * constructor
     * @param  {string} message - custom error message
     */
    constructor(message) {
        super(
            message || errorMessages.NotFoundError,
            errorCodes.NotFoundError,
            statusCodes.NotFoundError
        )
    }
}
