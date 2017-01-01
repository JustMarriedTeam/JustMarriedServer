import { createAccount } from "../services/account.service";
import HttpStatus from "http-status";

function postAccount(req, res, done) {
  createAccount({
    login: req.body.login,
    password: req.body.password
  }).then((account) => res.status(HttpStatus.OK).json({
    login: account.login
  })).catch(() => res.status(HttpStatus.BAD_REQUEST).json({
    message: "Cannot create account"
  })).finally(done);
}

export { postAccount };
