import session from "express-session";
import properties from "../properties";

const MemcachedStore = require("connect-memcached")(session);

function configureSession(app) {
  app.use(session({
    secret: properties.get("session.secret"),
    ...((useRemote) => {

      if (useRemote) {
        return {
          store: new MemcachedStore({
            hosts: [properties.get("memcache.url")]
          })
        };
      } else {
        return {};
      }

    })(properties.get("session.remote"))
  }));
}

export { configureSession };
