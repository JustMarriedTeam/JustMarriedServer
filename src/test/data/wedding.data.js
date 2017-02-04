import Wedding from "../../main/models/wedding.model";
import builderDecorator from "../utils/builder.decorator";
import map from "lodash/map";

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
