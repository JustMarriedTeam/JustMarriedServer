import bodyParser from "body-parser";
import forOwn from "lodash/forOwn";
import unset from "lodash/unset";
import isObject from "lodash/isObject";

function convertIdsIn(value) {
  forOwn(value, (v, k) => {
    if (k === "id") {
      unset(value, k);
      value._id = v;
    } else if (isObject(v)) {
      convertIdsIn(v);
    }
  });
}

function configureConverters(app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use((req, res, next) => {
    convertIdsIn(req.body);
    next();
  });
}

export {configureConverters};
