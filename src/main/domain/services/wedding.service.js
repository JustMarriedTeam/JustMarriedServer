import Wedding from "../models/wedding.model";
import Account, { ACCOUNT_ASSIGNMENT } from "../models/account.model";
import {getFromRequestContext} from "../../context";
import {aWedding} from "../../domain/builders/wedding.builder";
import WeddingUpdater from "../updaters/wedding.updater";

function getWeddingOfLoggedUser() {
  const actingUser = getFromRequestContext("user.user");
  return Wedding.findByOwner(actingUser);
}

function createWedding(weddingDetails) {
  const actingUser = getFromRequestContext("user.user");
  const {guests, participants, tasks} = weddingDetails;

  const wedding = aWedding()
    .withParticipants(participants)
    .withGuests(guests)
    .withOwner(actingUser)
    .withTasks(tasks)
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
  }).then(() => Account.markAssignmentComplete(actingUser, ACCOUNT_ASSIGNMENT.FILL_WEDDING));
}

export {
  getWeddingOfLoggedUser,
  createWedding,
  updateWedding
};
