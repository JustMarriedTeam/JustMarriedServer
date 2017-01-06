import database from "../database";
import Task from "./task.model";

const UserSchema = new database.Schema({
  username: String,
  firstName: String,
  lastName: String,
  status: String,
  actors: [ { type: database.Schema.ObjectId, ref: "User" } ]
});

UserSchema.method({

  toJSON() {
    return this.toObject({
      versionKey: false
    });
  },

  getTasks() {
    return Task.find({ owner: this }).exec();
  }

});

export default database.model("User", UserSchema);
