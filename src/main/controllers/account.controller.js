import { createAccount, getLoggedUserAccount } from "../domain/services/account.service";
import HttpStatus from "http-status";

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
    .then((account) => res.json(account))
    .then(() => res.status(HttpStatus.OK))
    .finally(done);
}

export { getAccount, postAccount };
