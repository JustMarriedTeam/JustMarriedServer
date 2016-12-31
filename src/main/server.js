import logger from './logger'

logger.info(
    `
       Server info:
        protocol: ${process.env.protocol},
        host: ${process.env.host},
        domain: ${process.env.domain},
        port: ${process.env.port}
        
    `
);

export const SERVER_URI = `${process.env.protocol}://${process.env.host}`
    + (!process.env.domain ? `:${process.env.port}` : '');