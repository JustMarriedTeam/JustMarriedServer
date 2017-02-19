import { createAccount, getLoggedUserAccount } from "../domain/services/account.service";
import HttpStatus from "http-status";
import omit from "lodash/omit";

const withoutSecurityIdentifiers = (account) =>
  omit(account.toJSON(), [ "password", "external" ]);

function postAccount(req, res, done) {
  createAccount({
    login: req.body.login,
    password: req.body.password,
    user: req.body.user
  }).then((account) => res.status(HttpStatus.OK).json(account))
    .catch(() => res.status(HttpStatus.BAD_REQUEST).json({
      message: "Cannot create account"
    })).finally(done);
}

function getAccount(req, res, done) {
  getLoggedUserAccount()
    .then((account) => {
      res.json(withoutSecurityIdentifiers(account));
      return account;
    })
    .then(() => res.status(HttpStatus.OK))
    .finally(done);
}

export { getAccount, postAccount };
