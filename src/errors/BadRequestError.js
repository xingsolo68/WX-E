import { errorMessages, errorCodes, statusCodes } from './constants'
import { CustomError } from './CustomError'
/**
 * BadRequestError
 *
 * @class BadRequestError
 * @extends {CustomError}
 */
export class BadRequestError extends CustomError {
    /**
     * constructor
     * @param  {string} message - custom error message
     */
    constructor(message) {
        super(
            message || errorMessages.BAD_REQUEST,
            errorCodes.BAD_REQUEST,
            statusCodes.BAD_REQUEST
        )
    }
}
