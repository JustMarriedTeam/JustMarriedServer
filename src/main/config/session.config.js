import session from "express-session";
import properties from "../properties";

const MemcachedStore = require("connect-memjs")(session);

function configureSession(app) {
  app.use(session({
    secret: "sdfsdf2323fef", //properties.get("session.secret"),
    resave: false,
    saveUninitialized: false,
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
