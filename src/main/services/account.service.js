import Account from "../models/account.model";

function createAccount(credentials) {
  return Account.findOneAsync({"login": credentials.login})
        .then((account) => {
          if (account) {throw new Error("Account already exists");}
        })
        .then(() => {
          const account = new Account();
          account.login = credentials.login;
          account.setPassword(credentials.password);
          return account.saveAsync().then(() => account);
        });
}

export {createAccount};
