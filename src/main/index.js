import mongoose from 'mongoose';
import util from 'util';
import envFile from 'node-env-file';

const debug = require('debug')('express-mongoose-es6-rest-api:index');

var app;

setUpEnvironment();
connectDatabase();
launchServer();

function setUpEnvironment() {
    envFile(`${__dirname}/env.properties`);
    envFile(`${process.env.configFile}`, {overwrite: true, raise: false});

    // make bluebird default Promise
    Promise = require('bluebird'); // eslint-disable-line no-global-assign
}

function connectDatabase() {
    mongoose.Promise = Promise;
    Promise.promisifyAll(mongoose);

    // connect to mongo db
    mongoose.connect(process.env.db, {server: {socketOptions: {keepAlive: 1}}});
    mongoose.connection.on('error', () => {
        throw new Error(`unable to connect to database: ${process.env.db}`);
    });

    // print mongoose logs in dev env
    if (process.env.MONGOOSE_DEBUG) {
        mongoose.set('debug', (collectionName, method, query, doc) => {
            debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
        });
    }
}

function launchServer() {
    app = require("./app.js");
    if (!module.parent) {
        app.listen(process.env.port, () => {
            debug(`server started on port ${process.env.port} (${process.env.env})`);
        });
    }
}

export default app;