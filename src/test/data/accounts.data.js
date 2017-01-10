import Account from "../../main/models/account.model";
import User from "../../main/models/user.model";
import builderDecorator from "../utils/builder.decorator";

const AccountBuilder = builderDecorator(Account);

function setUpAccounts(account) {
  return account.saveAsync();
}

function tearDownAccounts() {
  return Account.removeAsync();
}
// account.schema.obj
function anAccount() {
  return new AccountBuilder()
    .withUser(new User({
      firstName: "firstName",
      lastName: "lastName"
    }));
}

export {
  anAccount,
  setUpAccounts,
  tearDownAccounts
};
