import Account from "../models/account.model";
import User from "../models/user.model";
import Promise from "bluebird";

function createAccount(credentials) {
  return Account.findOneAsync({"login": credentials.login})
        .then((account) => {
          if (account) {throw new Error("Account already exists");}
        })
        .then(() => {
          const account = new Account();
          account.login = credentials.login;
          account.setPassword(credentials.password);
          const user = new User({
            username: credentials.login
          });
          account.user = user;

          return Promise.join(
            account.saveAsync(),
            user.saveAsync()
          , (savedAccount) => savedAccount);
        });
}

export {createAccount};
