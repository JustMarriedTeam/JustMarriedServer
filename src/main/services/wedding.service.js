import Wedding from "../models/wedding.model";
import merge from "lodash/merge";
import extend from "lodash/extend";
import { getFromRequestContext } from "../context";

function getWeddingOfLoggedUser() {
  const actingUser = getFromRequestContext("user.user");
  return Wedding.findByOwner(actingUser);
}

function createWedding(weddingDetails) {
  const actingUser = getFromRequestContext("user.user");
  const wedding = new Wedding(merge({}, weddingDetails, {
    owners: [actingUser]
  }));
  return wedding.saveAsync();
}

function updateWedding(weddingDetails) {
  const actingUser = getFromRequestContext("user.user");
  return Wedding.findByOwner(actingUser).then((currentWedding) => {
    extend(currentWedding, weddingDetails);
    return currentWedding.saveAsync();
  });
}

export {
  getWeddingOfLoggedUser,
  createWedding,
  updateWedding
};
