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
    Promise = require('bluebird');
}

function connectDatabase() {
    mongoose.Promise = Promise;
    Promise.promisifyAll(mongoose);

    // connect to mongo db
    mongoose.connect(process.env.dbUrl, {server: {socketOptions: {keepAlive: 1}}});
    mongoose.connection.on('error', () => {
        throw new Error(`unable to connect to database: ${process.env.dbUrl}`);
    });

    // print mongoose logs in dev env
    if (process.env.MONGOOSE_DEBUG) {
        mongoose.set('err', (collectionName, method, query, doc) => {
            err(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
        });
    }
}

function launchServer() {
    app = require("./app.js");
    if (!module.parent) {
        logger.info(`Starting server on ${process.env.port} port`);
        app.listen(process.env.port, () => {
            logger.info(`server started on port ${process.env.port} (${process.env.env})`);
        });
    }
}

export default app;