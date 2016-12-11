import mongoose from 'mongoose';
import util from 'util';
import envFile from 'node-env-file';

const debug = require('debug')('express-mongoose-es6-rest-api:index');

var app;

setUpEnvironment();
connectDatabase();
launchServer();

function setUpEnvironment() {
    const configFile = process.env.configFile;
    envFile(__dirname + '/env.properties');
    envFile(`${configFile}`, {overwrite: true, raise: false});

    console.log("jwtToken", process.env.jwtToken);

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
    app = require("./app.js");
    if (!module.parent) {
        app.listen(process.env.port, () => {
            debug(`server started on port ${process.env.port} (${process.env.env})`);
        });
    }
}

export default app;