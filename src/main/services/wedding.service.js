import Wedding from "../models/wedding.model";
import { getFromRequestContext } from "../context";


function getWeddingOfLoggedUser() {
  const actingUser = getFromRequestContext("user.user");
  return Wedding.findOne({
    $or: [
      { "participants.bride": actingUser },
      { "participants.groom": actingUser }
    ]
  }).populate("participants.groom participants.bride").exec();
}

export { getWeddingOfLoggedUser };
