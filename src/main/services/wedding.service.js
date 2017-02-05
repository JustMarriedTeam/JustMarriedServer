import Wedding from "../models/wedding.model";
import merge from "lodash/merge";
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

export {
  getWeddingOfLoggedUser,
  createWedding
};
