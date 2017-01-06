/* eslint-disable max-params */
import HttpStatus from "http-status";
import { listUsers } from "../services/user.service";

function getUsers(req, res, done) {
  listUsers(req.query).then((users) => res.status(HttpStatus.OK).json(users))
    .catch((err) => res.status(HttpStatus.BAD_REQUEST).json(err))
    .finally(done);
}

export {getUsers};
