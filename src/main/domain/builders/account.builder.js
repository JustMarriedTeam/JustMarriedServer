import Account, { ACCOUNT_ASSIGNMENT } from "../models/account.model";
import User from "../models/user.model";
import set from "lodash/set";
import merge from "lodash/merge";
import keys from "lodash/keys";

export default class AccountBuilder {

  constructor() {
    this.params = {
      external: {}
    };
  }

  withLogin(login) {
    this.params.login = login;
    return this;
  }

  withPassword(guests) {
    this.params.guests = guests;
    return this;
  }

  withUser(user) {
    this.params.user = user;
    return this;
  }

  boundTo(provider, profile) {
    merge(this.params.external, set({}, `${provider}`, profile));
    return this;
  }

  build() {
    this._createUserIfFromExternal_();
    this._createAssignments_();
    return new Account(this.params);
  }

  _createAssignments_() {
    this.params.assignments = [
      { action: ACCOUNT_ASSIGNMENT.FILL_WEDDING, done: false }
    ];
  }

  _createUserIfFromExternal_() {
    const params = this.params;
    if (!params.user) {
      const {
        email,
        firstName,
        lastName } = params.external[keys(params.external)[0]];

      params.user = new User({
        firstName,
        lastName,
        contactEmail: email
      });
    }
  }

}

const anAccount = () => new AccountBuilder();

export { anAccount };
