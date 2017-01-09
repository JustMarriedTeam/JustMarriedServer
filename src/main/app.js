import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import methodOverride from "method-override";
import cors from "cors";
import httpStatus from "http-status";

import expressValidation from "express-validation";
import helmet from "helmet";

import APIError from "./helpers/api.error";

import { configureSecurity } from "./config/security.config";
import { configureSession } from "./config/session.config";
import { configureLogging } from "./config/logging.config";
import { configureSwagger } from "./config/swagger.config";


const app = express();

configureSession(app);
configureLogging(app);
configureSecurity(app);
configureSwagger(app);
configureOthers();
configureErrorHandling();
configureNotFoundBehaviour();

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


export default app;
