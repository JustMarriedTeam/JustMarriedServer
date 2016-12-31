import logger from './logger';
import properties from './properties';

let protocol = properties.get('protocol');
let host = properties.get('host');
let domain = properties.get('domain');
let port = properties.get('port');

logger.info(
    `
       Server info:
        protocol: ${protocol},
        host: ${host},
        domain: ${domain},
        port: ${port}
        
    `
);

export const SERVER_URI = `${protocol}://${host}` + (!domain ? `:${port}` : '');