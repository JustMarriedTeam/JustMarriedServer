import { createAccount } from "../domain/services/account.service";
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

export { postAccount };
