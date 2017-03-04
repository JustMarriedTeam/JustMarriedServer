import Account from "../models/account.model";
import Promise from "bluebird";
import set from "lodash/set";
import merge from "lodash/merge";
import omit from "lodash/omit";
import {getFromRequestContext} from "../../context";
import {anAccount} from "../builders/account.builder";
import {createWedding} from "./wedding.service";

function doCreateAccount(accountBuilder) {
  return accountBuilder.build().saveAsync()
    .then((account) => createWedding(account).then(() => account));
}

function doMergeAccounts(existingAccount, account) {
  if (existingAccount.id !== account.id) {
    const accountDetails = omit(account.toJSON(), "_id", "user._id");
    merge(existingAccount, accountDetails);
    return Promise.join(
      existingAccount.saveAsync(),
      account.user.removeAsync(),
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


function createAccount({login, password, user}) {
  return Account.findOneAsync({login})
    .then((account) => {
      if (account) {
        throw new Error("Account already exists");
      }
    })
    .then(() => doCreateAccount(
      anAccount()
        .withLogin(login)
        .withPassword(password)
        .withUser(user)
    ));
}

function bindOrCreate(provider, profile, {id} = {}) {
  return Promise.join(
    Account.findOneAsync({[`external.${provider}.id`]: profile.id}),
    id ? Account.findById(id) : Promise.resolve(null),
    (account, primaryAccount) => {
      if (primaryAccount) {
        if (account) {
          return doMergeAccounts(primaryAccount, account);
        } else {
          return doExtendAccount(primaryAccount, {
            external: set({}, `${provider}`, profile)
          });
        }
      } else if (account) {
        return Promise.resolve(account);
      } else {
        return doCreateAccount(
          anAccount().boundTo(provider, profile)
        );
      }
    }
  ).then((createdAccount) => createdAccount.populateAsync("user"));
}

function getLoggedUserAccount() {
  const actingUser = getFromRequestContext("user.user");
  return Account.findByUser(actingUser);
}

export {getLoggedUserAccount, createAccount, bindOrCreate};
