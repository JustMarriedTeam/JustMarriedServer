import session from "express-session";
import properties from "../properties";

const MemcachedStore = require("connect-memjs")(session);

function configureSession(app) {
  app.use(session({
    secret: properties.get("session.secret"),
    ...((useRemote) => {

      if (useRemote) {
        return {
          store: new MemcachedStore({
            servers: properties.get("memcached.servers").split(","),
            username: properties.get("memcached.username"),
            password: properties.get("memcached.password")
          })
        };
      } else {
        return {};
      }

    })(properties.get("session.remote"))
  }));
}

export { configureSession };
