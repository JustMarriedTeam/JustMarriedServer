import logger from "./logger";
import properties from "./properties";

const protocol = properties.get("protocol");
const host = properties.get("host");
const domain = properties.get("domain");
const port = properties.get("port");

logger.info(
    `
       Server info:
        protocol: ${protocol},
        host: ${host},
        domain: ${domain},
        port: ${port}
        
    `
);

export const SERVER_URI = `${protocol}://${host}${!domain ? `:${port}` : ""}`;
