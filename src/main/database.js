import mongoose from "mongoose";
import util from "util";
import Promise from "bluebird";
import properties from "./properties";
import logger from "./logger";

mongoose.Promise = Promise;
Promise.promisifyAll(mongoose);

const dbUrl = properties.get("dbUrl");
mongoose.connect(dbUrl, {server: {socketOptions: {keepAlive: 1}}});
mongoose.connection.on("error", () => {
  throw new Error(`unable to connect to database: ${dbUrl}`);
});

if (properties.get("MONGOOSE_DEBUG")) {
  mongoose.set("err", (collectionName, method, query, doc) => { // eslint-disable-line
    const sth = 20;
    logger.error(`${collectionName}.${method}`, util.inspect(query, false, sth), doc);
  });
}

mongoose.plugin((schema) => {
  schema.options.toJSON = {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  };
});

export default mongoose;
