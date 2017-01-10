import Account from "../models/account.model";
import User from "../models/user.model";
import Promise from "bluebird";
import set from "lodash/set";
import merge from "lodash/merge";
import omit from "lodash/omit";

function doCreateAccount(details) {
  const account = new Account();

  if (details.login) {
    account.login = details.login;
    account.setPassword(details.password);
  }

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

function doMergeAccounts(existingAccount, account) {
  if (existingAccount.id !== account.id) {
    const accountDetails = omit(account.toJSON(), "_id");
    merge(existingAccount, accountDetails);
    return Promise.join(
      existingAccount.saveAsync(),
      account.removeAsync(),
      (unifiedAccount) => unifiedAccount
    );
  } else {
    return Promise.resolve(existingAccount);
  }
}

function doExtendAccount(account, accountExtension) {
  merge(account, accountExtension);
  return account.saveAsync();
}


function createAccount(details) {
  return Account.findOneAsync({"login": details.login})
        .then((account) => {
          if (account) {throw new Error("Account already exists");}
        })
        .then(() => doCreateAccount(details));
}

function bindOrCreate(provider, profile, existingAccount) {
  return Account.findOneAsync({ [`external.${provider}.id`]: profile.id })
    .then((account) => {
      if (existingAccount) {
        existingAccount.isNew = false;
        if (account) {
          return doMergeAccounts(existingAccount, account);
        } else {
          return doExtendAccount(existingAccount, {
            external: set({}, `${provider}`, profile)
          });
        }
      } else if (account) {
        return Promise.resolve(account);
      } else {
        return doCreateAccount({
          external: set({}, `${provider}`, profile)
        });
      }
    });
}

export { createAccount, bindOrCreate };
