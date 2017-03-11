import Promise from "bluebird";
import {runInContext, setInContext} from "../../main/context";

export const runFromAccount = (account) =>
  (action) => runInContext(() => {
    setInContext("request", { user: account });
    return Promise.resolve(action());
  });
