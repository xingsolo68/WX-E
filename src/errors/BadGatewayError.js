import { errorMessages, errorCodes, statusCodes } from './constants'
import { CustomError } from './CustomError'
/**
 * BadGatewayError
 *
 * @class BadGatewayError
 * @extends {CustomError}
 */
export class BadGatewayError extends CustomError {
    /**
     * constructor
     * @param  {string} message - custom error message
     */
    constructor(message) {
        super(
            message || errorMessages.BAD_GATEWAY,
            errorCodes.BAD_GATEWAY,
            statusCodes.BAD_GATEWAY
        )
    }
}
