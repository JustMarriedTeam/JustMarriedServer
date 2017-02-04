import Wedding from "../models/wedding.model";
import { getFromRequestContext } from "../context";

function getWeddingOfLoggedUser() {
  const actingUser = getFromRequestContext("user.user");
  return Wedding.findByOwner(actingUser);
}

export {
  getWeddingOfLoggedUser
};
