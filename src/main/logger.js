import winston from 'winston';
import properties from './properties'

const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            json: false,
            prettyPrint: true,
            colorize: true,
            silent: false,
            timestamp: true,
            level: properties.logLevel
        })
    ]
});

export default logger;
