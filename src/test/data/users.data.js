import User from "../../main/models/user.model";
import map from "lodash/map";
import builderDecorator from "../utils/builder.decorator";

const UserBuilder = builderDecorator(User);

function setUpUsers(...users) {
  return Promise.all(map(users, (user) => user.saveAsync()));
}

function tearDownUsers() {
  return User.removeAsync();
}

function aSmallUser() {
  return new UserBuilder()
    .withUsername("smallUsername")
    .withFirstName("smallFirstName")
    .withLastName("smallLastName")
    .withStatus("active");
}

function aBigUser() {
  return new UserBuilder()
    .withUsername("bigUsername")
    .withFirstName("bigFirstName")
    .withLastName("bigLastName")
    .withStatus("active");
}

const bigUser = aSmallUser().build();
const smallUser = aBigUser().build();

export {
  aSmallUser,
  aBigUser,
  bigUser,
  smallUser,
  setUpUsers,
  tearDownUsers
};
