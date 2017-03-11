import Promise from "bluebird";
import {runInContext, setInContext} from "../../main/context";

export const runFromAccount = (account) =>
  (action) => new Promise((resolve, reject) => {
    runInContext(() => {
      setInContext("request", { user: account });
      return Promise.resolve(action())
        .then(resolve).catch(reject);
    });
  });
