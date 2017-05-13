import logger from "./logger";
import properties from "./properties";

const protocol = properties.get("PROTOCOL");
const host = properties.get("HOST");
const domain = properties.get("DOMAIN");
const port = properties.get("PORT");

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
