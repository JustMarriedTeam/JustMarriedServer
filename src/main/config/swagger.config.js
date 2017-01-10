import swaggerizeExpress from "swaggerize-express";

const api = require("../api.json");

function configureSwagger(app) {
  app.use(swaggerizeExpress({
    api,
    docspath: "/api-docs",
    handlers: "../handlers",
    security: "../security"
  }));
}

export { configureSwagger };
