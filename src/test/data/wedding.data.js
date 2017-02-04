import Wedding from "../../main/models/wedding.model";
import builderDecorator from "../utils/builder.decorator";
import map from "lodash/map";

import {
  redTask,
  blackTask,
  blueTask,
  greenTask
} from "./tasks.data";

import {
  groom,
  bride
} from "./participants.data";

const WeddingBuilder = builderDecorator(Wedding);


function setUpWeddings(...weddings) {
  return Promise.all(map(weddings, (wedding) => wedding.saveAsync()));
}

function tearDownWeddings() {
  return Wedding.removeAsync();
}

function aWedding() {
  return new WeddingBuilder();
}

function aBlueWedding() {
  return aWedding()
    .withOwners([
      groom.user,
      bride.user
    ])
    .withParticipants([
      groom,
      bride
    ])
    .withTasks([
      redTask,
      blueTask,
      greenTask,
      blackTask
    ])
    .withGuests([
      { firstName: "firstNameA", lastName: "lastNameA" },
      { firstName: "firstNameB", lastName: "lastNameB" }
    ]);
}

export {
  aWedding,
  aBlueWedding,
  setUpWeddings,
  tearDownWeddings
};
