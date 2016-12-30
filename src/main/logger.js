import winston from 'winston';
import properties from './properties'

const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            json: true,
            colorize: true,
            level: properties.logLevel
        })
    ]
});

export default logger;
