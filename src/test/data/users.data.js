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

function aUser() {
  return new UserBuilder()
    .withFirstName("firstName")
    .withLastName("lastName")
    .withStatus("active");
}

export {
  aUser,
  setUpUsers,
  tearDownUsers
};
