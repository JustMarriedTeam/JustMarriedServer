import express from "express";
import logger from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import methodOverride from "method-override";
import cors from "cors";
import httpStatus from "http-status";
import expressWinston from "express-winston";
import expressValidation from "express-validation";
import helmet from "helmet";
import winstonInstance from "./logger";
import APIError from "./helpers/api.error";
import swaggerizeExpress from "swaggerize-express";
import passport from "passport";
import properties from "./properties";

const app = express();
const env = properties.get("env");
const api = require("./api.json");


initializeLogging();
configureOthers();
setupAuth();
swaggerize();
configureErrorHandling();
configureNotFoundBehaviour();

function setupAuth() {
  app.use(passport.initialize());
}

function swaggerize() {
  app.use(swaggerizeExpress({
    api,
    docspath: "/api-docs",
    handlers: "./handlers",
    security: "./security"
  }));
}

function configureOthers() {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(compress());
  app.use(methodOverride());
  app.use(helmet());
  app.use(cors());
}

function configureNotFoundBehaviour() {
  app.use((req, res, next) => {
    const err = new APIError("API not found", httpStatus.NOT_FOUND);
    return next(err);
  });
}

function configureErrorHandling() {
  app.use((err, req, res, next) => { // eslint-disable-line max-params
    if (err instanceof expressValidation.ValidationError) {
      const unifiedErrorMessage = err.errors.map((error) =>
        error.messages.join(". ")).join(" and ");
      const error = new APIError(unifiedErrorMessage, err.status, true);
      return next(error);
    } else if (!(err instanceof APIError)) {
      const apiError = new APIError(err.message, err.status, err.isPublic);
      return next(apiError);
    }
    return next(err);
  });
}

function initializeLogging() {
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

export default app;
