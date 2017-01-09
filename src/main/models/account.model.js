import database from "../database";
import bcrypt from "bcrypt-nodejs";
import User from "./user.model";

const SALT_LENGTH = 8;

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
      name: String
    },
    google: {
      id: String,
      token: String,
      email: String,
      name: String
    }
  },
  user: {
    type: database.Schema.ObjectId,
    ref: User.modelName
  }
});

AccountSchema.methods.setPassword = function (password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_LENGTH), null);
};

AccountSchema.methods.isPasswordValid = function (password) {
  return bcrypt.compareSync(password, this.password);
};

export default database.model("Account", AccountSchema);
