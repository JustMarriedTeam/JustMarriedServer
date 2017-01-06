import User from "../../main/models/user.model";
import map from "lodash/map";
import forEach from "lodash/forEach";
import builderDecorator from "../utils/builder.decorator";

const UserBuilder = builderDecorator(User);

function pairwise(list) {
  if (list.length < 2) { return []; }
  const first = list[0];
  const rest = list.slice(1);
  const pairs = rest.map((x) => { return [first, x]; });
  return pairs.concat(pairwise(rest));
}

function setUpUsers(...users) {
  return Promise.all(map(users, (user) => user.saveAsync()));
}

function connectUsers(...users) {
  const pairs = pairwise(users);
  forEach(pairs, (pair) => {
    const firstUser = pair[0];
    const secondUser = pair[1];
    firstUser.actors.push(secondUser);
    secondUser.actors.push(firstUser);
  });
  return Promise.all(map(users, (user) => user.saveAsync()));
}

function tearDownUsers() {
  return User.removeAsync();
}

function aUser() {
  return new UserBuilder()
    .withStatus("active");
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
  aUser,
  aSmallUser,
  aBigUser,
  bigUser,
  smallUser,
  setUpUsers,
  connectUsers,
  tearDownUsers
};
