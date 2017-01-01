import Account from "../../main/models/account.model";
import User from "../../main/models/user.model";

const blueAccount = new Account({
  user: new User({
    firstName: "firstName",
    lastName: "lastName"
  })
});

function setUpAccounts(account) {
  return account.saveAsync();
}

function tearDownAccounts() {
  return Account.removeAsync();
}

export {
  blueAccount,
  setUpAccounts,
  tearDownAccounts
};
