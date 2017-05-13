import mongoose from "mongoose";
import util from "util";
import Promise from "bluebird";
import properties from "./properties";
import logger from "./logger";
import map from "lodash/fp/map";
import get from "lodash/get";
import merge from "lodash/merge";

mongoose.Promise = Promise;
Promise.promisifyAll(mongoose);

const dbUrl = properties.get("DB_URL");
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

export const asObjectId = (id) => new mongoose.Types.ObjectId(id);
export const allAsObjectId = (idList) => map((id) => asObjectId(id))(idList);

export default mongoose;
