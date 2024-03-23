import winston from 'winston'

const { combine, timestamp, json } = winston.format

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'debug',
    format: combine(timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }), json()),
    transports: [
        new winston.transports.Console(),
        // new winston.transports.File({ filename: 'error.log', level: 'error' })
    ],
    colorize: true,
})

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    )
}
