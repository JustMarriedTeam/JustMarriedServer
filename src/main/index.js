/* eslint-disable filenames/no-index */
import logger from "./logger";
import properties from "./properties";

let app;

setUpEnvironment();
connectDatabase();
launchServer();

function setUpEnvironment() {
  logger.debug(`Environment variables: ${JSON.stringify(properties)}`);
  Promise = require("bluebird"); // eslint-disable-line
}

function connectDatabase() {
  require('./database'); // eslint-disable-line
}

function launchServer() {
  app = require("./app.js"); // eslint-disable-line
  if (!module.parent) {
    const port = properties.get("port");
    const env = properties.get("env");
    logger.info(`Starting server on ${port} port`);
    app.listen(port, () => {
      logger.info(`server started on port ${port} (${env})`);
    });
  }
}

export default app;
