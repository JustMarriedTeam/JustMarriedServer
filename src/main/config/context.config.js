import { bindEmitter, runInContext, setInContext } from "../context";

function configureContext(app) {
  app.use((req, res, next) => {
    bindEmitter(req);
    bindEmitter(res);
    runInContext(() => {
      setInContext("request", req);
      next();
    });
  });
}

export { configureContext };
