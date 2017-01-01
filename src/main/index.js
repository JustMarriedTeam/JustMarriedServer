/* eslint-disable filenames/no-index */
import mongoose from "mongoose";
import util from "util";
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
  mongoose.Promise = Promise;
  Promise.promisifyAll(mongoose);

  const dbUrl = properties.get("dbUrl");
    // connect to mongo db
  mongoose.connect(dbUrl, {server: {socketOptions: {keepAlive: 1}}});
  mongoose.connection.on("error", () => {
    throw new Error(`unable to connect to database: ${dbUrl}`);
  });

    // print mongoose logs in dev env
  if (properties.get("MONGOOSE_DEBUG")) {
    mongoose.set("err", (collectionName, method, query, doc) => { // eslint-disable-line
      const sth = 20;
      logger.error(`${collectionName}.${method}`, util.inspect(query, false, sth), doc);
    });
  }
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
