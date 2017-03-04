/* eslint-disable max-params */
import HttpStatus from "http-status";
import {
  getWeddingOfLoggedUser,
  updateWedding } from "../domain/services/wedding.service";

function getWedding(req, res, done) {
  getWeddingOfLoggedUser().then((wedding) => res.status(HttpStatus.OK).json(wedding))
    .catch((err) => res.status(HttpStatus.BAD_REQUEST).json(err))
    .finally(done);
}

function putWedding(req, res, done) {
  updateWedding(req.body).then((wedding) => res.status(HttpStatus.OK).json(wedding))
    .catch((err) => res.status(HttpStatus.BAD_REQUEST).json(err))
    .finally(done);
}

export { getWedding, putWedding };
