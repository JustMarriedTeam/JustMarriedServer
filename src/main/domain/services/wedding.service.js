import Wedding from "../models/wedding.model";
import map from "lodash/fp/map";
import extend from "lodash/extend";
import zipObject from "lodash/zipObject";
import omit from "lodash/omit";
import database from "../../database";
import {getFromRequestContext} from "../../context";
import {aWedding} from "../../domain/builders/wedding.builder";

const extractIds = map((value) => {
  return value.id;
});

const entities = ["participants", "guests", "tasks"];

const pullIfNotPresent = (weddingDetails) => ({
  $pull: {
    ...zipObject(entities, map((v) => ({
      _id: {
        $nin: extractIds(weddingDetails[v])
      }
    }))(entities))
  }
});


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
  // const actingUser = getFromRequestContext("user.user");

  return Wedding.update({_id: weddingDetails.id}, {
    ...pullIfNotPresent(weddingDetails)
  });

  // return Wedding.update({_id: weddingDetails.id}, {
  //     $pull: {
  //       participants: {
  //         _id: {
  //           $nin: extractIds(weddingDetails.participants)
  //         }
  //       }
  //     }
  //   }
  // );

  // {
  //   multi: true
  // }

  // $set: {
  //   participants: weddingDetails.participants,
  //   guests: weddingDetails.guests
  // }

  // return Wedding.findByOwner(actingUser).then((currentWedding) => {
  //   extend(currentWedding, weddingDetails);
  //   return currentWedding.saveAsync();
  // });
}

export {
  getWeddingOfLoggedUser,
  createWedding,
  updateWedding
};
