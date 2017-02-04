import Account from "../../main/models/account.model";
import User from "../../main/models/user.model";
import builderDecorator from "../utils/builder.decorator";
import {
  redUser,
  greenUser
} from "./users.data";

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

const redAccount = anAccount().withUser(redUser).build();
const greenAccount = anAccount().withUser(greenUser).build();

export {
  anAccount,
  setUpAccounts,
  tearDownAccounts,
  redAccount,
  greenAccount
};
