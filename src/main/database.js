/* global process */
import mongoose from "mongoose";
import util from "util";
import Promise from "bluebird";
import properties from "./properties";
import logger from "./logger";
import map from "lodash/fp/map";
import get from "lodash/get";
import merge from "lodash/merge";
import sleep from "sleep";

mongoose.Promise = Promise;
Promise.promisifyAll(mongoose);

const db = mongoose.connection;

const dbUrl = properties.get("DB_URL");
const dbConnectRetryTime = properties.get("DB_CONNECT_RETRY_TIME");
const dbConnectMaxTries = properties.get("DB_CONNECT_TRIES");

let wasConnectedBefore = false;
let initialConnectionAttempts = 0;

function reconnect() {
  if(initialConnectionAttempts <= dbConnectMaxTries) {
    initialConnectionAttempts++;
    logger.info(`Trying to establish initial connection with Mongo at ${dbUrl} - ${initialConnectionAttempts} try...`);
    sleep.msleep(dbConnectRetryTime);
    mongoose.connect(dbUrl, {
        server: {
          // Mongoose internal reconnect options work only if the first connection was successful.
          // This is why we have to keep wasConnectedBefore variable to do this manually but only if this is an
          // initial connection.
          autoReconnect: true,
          reconnectInterval: dbConnectRetryTime,
          reconnectTries: dbConnectMaxTries,
          socketOptions: {
            keepAlive: 1
          }
        }
      }).catch(() => {});
  } else {
    throw `Could not connect to ${dbUrl} in ${dbConnectMaxTries} * ${dbConnectRetryTime} ms. Shutting down.`;
  }
}

db.on('connected', () => {
  wasConnectedBefore = true;
  console.log(`Mongoose connection open to ${dbUrl}`);
});

db.on("error", () => {
  logger.error('Lost connection to the database. Retrying...');
  mongoose.disconnect();
});

db.on('reconnected', () => {
  logger.info(`Mongoose connection ${dbUrl} reconnected!`);
});

db.on('disconnected', () => {
  logger.info(`Mongoose connection ${dbUrl} disconnected`);
  if (!wasConnectedBefore) {
    reconnect();
  }
});

process.on('SIGINT', function () {
  db.close(function () {
    logger.info(`Mongoose connection ${dbUrl} disconnected through app termination`);
  });
});

if (properties.get("MONGOOSE_DEBUG")) {
  mongoose.set("err", (collectionName, method, query, doc) => { // eslint-disable-line
    const sth = 20;
    logger.error(`${collectionName}.${method}`, util.inspect(query, false, sth), doc);
  });
}

mongoose.plugin((schema) => {

  const toJsonTransform = get(schema.options, "toJSON.transform");

  schema.options = merge({

    toJSON: {
      virtuals: true,
      versionKey: false
    }

  }, schema.options, {

    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        if (toJsonTransform) {
          toJsonTransform.apply({}, arguments);
        }
      }
    }

  });

});

reconnect();

export const asObjectId = (id) => new mongoose.Types.ObjectId(id);
export const allAsObjectId = (idList) => map((id) => asObjectId(id))(idList);

export default mongoose;
