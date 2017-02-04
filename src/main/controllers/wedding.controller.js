/* eslint-disable max-params */
import HttpStatus from "http-status";
import { getWeddingOfLoggedUser } from "../services/wedding.service";

function getWedding(req, res, done) {
  getWeddingOfLoggedUser().then((wedding) => res.status(HttpStatus.OK).json(wedding))
    .catch((err) => res.status(HttpStatus.BAD_REQUEST).json(err))
    .finally(done);
}

export { getWedding };
