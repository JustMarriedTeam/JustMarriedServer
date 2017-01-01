import Promise from "bluebird";
import mongoose from "mongoose";
import httpStatus from "http-status";
import APIError from "../helpers/APIError";

const DEFAULT_SKIP = 0;
const DEFAULT_LIMIT = 50;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true,
    match: [/^[1-9][0-9]{9}$/, "The value of path {PATH} ({VALUE}) is not a valid mobile number."]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

UserSchema.method({
});


UserSchema.statics = {

  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError("No such user exists!", httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  list({ skip = DEFAULT_SKIP, limit = DEFAULT_LIMIT } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

};

export default mongoose.model("User", UserSchema);
