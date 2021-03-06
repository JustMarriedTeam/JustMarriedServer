import database from "../../database";
import bcrypt from "bcrypt-nodejs";
import {UserSchema} from "./user.model";

const SALT_LENGTH = 8;

export const ACCOUNT_ASSIGNMENT = {
  FILL_WEDDING: "FILL_WEDDING"
};

const AccountSchema = new database.Schema({
  login: {
    type: String,
    index: true
  },
  password: {
    type: String,
    match: [/^.*$/, "The value of path {PATH} ({VALUE}) is not a valid password!"]
  },
  external: {
    facebook: {
      id: String,
      token: String,
      email: String,
      firstName: String,
      lastName: String
    },
    google: {
      id: String,
      token: String,
      email: String,
      firstName: String,
      lastName: String
    }
  },
  user: {
    type: UserSchema,
    required: true
  },
  assignments: [
    {
      action: String,
      done: Boolean
    }
  ]
});

AccountSchema.methods.setPassword = function (password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_LENGTH), null);
};

AccountSchema.methods.isPasswordValid = function (password) {
  return bcrypt.compareSync(password, this.password);
};

AccountSchema.static({

  findByUser(user) {
    return this.findOneAsync({ "user._id": user.id });
  },

  markAssignmentComplete(user, action) {
    return this.updateAsync({
      "user._id": user.id,
      "assignments": {
        $elemMatch: { action }
      }
    }, {
      $set: { "assignments.$.done": true }
    });
  }

});

export default database.model("Account", AccountSchema);
