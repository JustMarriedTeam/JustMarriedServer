import mongoose from 'mongoose';
import util from 'util';

const debug = require('debug')('express-mongoose-es6-rest-api:index');

setUpEnvironment();
connectDatabase();
launchServer();

function setUpEnvironment() {
    require("./config/envloader")();
    // make bluebird default Promise
    Promise = require('bluebird'); // eslint-disable-line no-global-assign
}

function connectDatabase() {
    // plugin bluebird promise in mongoose
    mongoose.Promise = Promise;

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
    var app = require("./app.js");
    if (!module.parent) {
        app.listen(process.env.port, () => {
            debug(`server started on port ${config.port} (${config.env})`);
        });
    }
    export default app;
}
