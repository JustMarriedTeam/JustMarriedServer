import Wedding from "../models/wedding.model";
import extend from "lodash/extend";
import { getFromRequestContext } from "../../context";
import { aWedding } from "../../domain/builders/wedding.builder";

function getWeddingOfLoggedUser() {
  const actingUser = getFromRequestContext("user.user");
  return Wedding.findByOwner(actingUser);
}

function createWedding(weddingDetails) {
  const actingUser = getFromRequestContext("user.user");
  const { guests, participants, tasks } = weddingDetails;

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
    extend(currentWedding, weddingDetails);
    return currentWedding.saveAsync();
  });
}

export {
  getWeddingOfLoggedUser,
  createWedding,
  updateWedding
};
