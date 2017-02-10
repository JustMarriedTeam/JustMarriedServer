import Account from "../../main/domain/models/account.model";
import User from "../../main/domain/models/user.model";
import builderDecorator from "../utils/builder.decorator";

const AccountBuilder = builderDecorator(Account);

function setUpAccounts(account) {
  return account.saveAsync();
}

function tearDownAccounts() {
  return Account.removeAsync();
}

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
