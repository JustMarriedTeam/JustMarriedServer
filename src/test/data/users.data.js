import User from "../../main/models/user.model";
import builderDecorator from "../utils/builder.decorator";

const UserBuilder = builderDecorator(User);

function aUser() {
  return new UserBuilder();
}

const redUser = aUser()
  .withUsername("bigUsername")
  .withFirstName("bigFirstName")
  .withLastName("bigLastName")
  .build();

const greenUser = aUser()
  .withUsername("smallUsername")
  .withFirstName("smallFirstName")
  .withLastName("smallLastName")
  .build();

export {
  aUser,
  redUser,
  greenUser
};
