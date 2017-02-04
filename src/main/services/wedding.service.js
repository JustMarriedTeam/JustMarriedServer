import Wedding from "../models/wedding.model";
import { getFromRequestContext } from "../context";

function getWeddingOfLoggedUser() {
  const actingUser = getFromRequestContext("user.user");
  return Wedding.findOneAsync({
    owners: {
      $elemMatch: actingUser
    }
  });
}

export { getWeddingOfLoggedUser };
