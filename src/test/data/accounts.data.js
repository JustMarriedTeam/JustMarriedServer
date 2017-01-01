import Account from "../../main/models/account.model";
import User from "../../main/models/user.model";
import BuilderDecorator from "../utils/builder.decorator";

function setUpAccounts(account) {
  return account.saveAsync();
}

function tearDownAccounts() {
  return Account.removeAsync();
}
// account.schema.obj
function anAccount() {
  return new BuilderDecorator(Account)
    .user(new User({
      firstName: "firstName",
      lastName: "lastName"
    }));
}

export {
  anAccount,
  setUpAccounts,
  tearDownAccounts
};
