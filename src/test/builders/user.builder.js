import User from "../../main/models/user.model";
import builderDecorator from "../utils/builder.decorator";

const UserBuilder = builderDecorator(User);

function aUser() {
  return new UserBuilder();
}

export {
  aUser
};
