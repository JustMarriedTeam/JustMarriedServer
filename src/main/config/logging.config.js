import expressWinston from "express-winston";
import logger from "morgan";
import properties from "../properties";
import winstonInstance from "../logger";

const env = properties.get("env");

function configureLogging(app) {
  if (env === "development") {
    app.use(logger("dev"));
    expressWinston.requestWhitelist.push("body");
    expressWinston.responseWhitelist.push("body");
    app.use(expressWinston.logger({
      winstonInstance,
      meta: true,
      msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
      colorStatus: true
    }));
  }

  if (env !== "test") {
    app.use(expressWinston.errorLogger({
      winstonInstance
    }));
  }
}

export { configureLogging };
