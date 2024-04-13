import { errorMessages, errorCodes, statusCodes } from './constants'
import { CustomError } from './CustomError'
/**
 * InternalServerError
 *
 * @class InternalServerError
 * @extends {CustomError}
 */
export class InternalServerError extends CustomError {
    /**
     * constructor
     * @param  {string} message - custom error message
     */
    constructor(message) {
        super(
            message || errorMessages.INTERNAL_SERVER_ERROR,
            errorCodes.INTERNAL_SERVER_ERROR,
            statusCodes.INTERNAL_SERVER_ERROR
        )
    }
}
