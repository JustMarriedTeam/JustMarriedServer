import session from "express-session";
import properties from "../properties";

const MemcachedStore = require("connect-memjs")(session);

function configureSession(app) {
  app.use(session({
    secret: properties.get("SESSION_SECRET"),
    resave: false,
    saveUninitialized: false,
    store: new MemcachedStore({
      servers: properties.get("MEMCACHED_SERVERS").split(","),
      username: properties.get("MEMCACHED_USERNAME"),
      password: properties.get("MEMCACHED_PASSWORD")
    })
  }));
}

export { configureSession };
