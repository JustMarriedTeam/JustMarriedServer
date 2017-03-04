import Wedding from "../models/wedding.model";
import Account, { ACCOUNT_ASSIGNMENT } from "../models/account.model";
import {getFromRequestContext} from "../../context";
import {aWedding} from "../../domain/builders/wedding.builder";
import WeddingUpdater from "../updaters/wedding.updater";

function getWeddingOfLoggedUser() {
  const actingUser = getFromRequestContext("user.user");
  return Wedding.findByOwner(actingUser);
}

function createWedding(account) {
  const wedding = aWedding()
    .withParticipants([])
    .withGuests([])
    .withOwner(account.user)
    .withTasks([])
    .build();

  return wedding.saveAsync();
}

function updateWedding(weddingDetails) {
  const actingUser = getFromRequestContext("user.user");
  return Wedding.findByOwner(actingUser).then((currentWedding) => {
    const updatedWedding = WeddingUpdater.of(currentWedding)
      .updateParticipants(weddingDetails.participants)
      .updateGuests(weddingDetails.guests)
      .updateTasks(weddingDetails.tasks)
      .get();
    return updatedWedding.saveAsync();
  }).then((wedding) => Account.markAssignmentComplete(actingUser, ACCOUNT_ASSIGNMENT.FILL_WEDDING)
    .then(() => wedding));
}

export {
  getWeddingOfLoggedUser,
  createWedding,
  updateWedding
};
