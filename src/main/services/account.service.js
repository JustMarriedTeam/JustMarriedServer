import Account from "../models/account.model";
import User from "../models/user.model";
import Promise from "bluebird";
import keys from "lodash/keys";
import map from "lodash/map";

function doCreateAccount(details) {
  const account = new Account();
  account.login = details.login;
  account.setPassword(details.password);
  account.external = details.external;

  const user = new User({
    username: details.login
  });
  account.user = user;

  return Promise.join(
    account.saveAsync(),
    user.saveAsync()
    , (savedAccount) => savedAccount);
}

function createAccount(details) {
  return Account.findOneAsync({"login": details.login})
        .then((account) => {
          if (account) {throw new Error("Account already exists");}
        })
        .then(() => doCreateAccount(details));
}

function bindToAccount(externalAccounts) {
  const providers = keys(externalAccounts);

  function getWhereForProvider(provider) {
    const where = {};
    where[`external.${provider}.id`] = externalAccounts[provider].id;
    return where;
  }

  return Account.findOneAsync({
    $or: [
      ...map(providers, (provider) => getWhereForProvider(provider))
    ]})
    .then((account) => {
      return account || doCreateAccount({
        external: externalAccounts
      });
    });
}

export { createAccount, bindToAccount };
