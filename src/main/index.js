import mongoose from 'mongoose';
import util from 'util';
import envFile from 'node-env-file';
import extend from 'lodash/extend';
import pick from 'lodash/pick';

const err = require('debug')('index:error');
const log = require('debug')('index:log');
log.log = console.log.bind(console);

let app;

log('xyz');
err('dupa');

setUpEnvironment();
connectDatabase();
launchServer();

function setUpEnvironment() {
    const passedEnvVariables = pick(process.env, 'port', 'envPropsFile', 'dbUrl', 'jwtSecret');
    envFile(`${__dirname}/env.properties`);
    const envPropsFile = passedEnvVariables['envPropsFile'];
    if(!!envPropsFile) {
        log(`Reading custom config from file ${envPropsFile}.`);
        envFile(envPropsFile, {overwrite: true, raise: false});
    }
    extend(process.env, passedEnvVariables);

    log(`Environment variables: ${JSON.stringify(process.env)}`);

    // make bluebird default Promise
    Promise = require('bluebird'); // eslint-disable-line no-global-assign
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
        log(`Starting server on ${process.env.port} port`);
        app.listen(process.env.port, () => {
            err(`server started on port ${process.env.port} (${process.env.env})`);
        });
    }
}

export default app;