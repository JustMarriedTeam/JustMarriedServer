import database from "../database";
import Task from "./task.model";

const UserSchema = new database.Schema({
  firstName: String,
  lastName: String,
  status: String
});

UserSchema.methods.getTasks = function () {
  return Task.find({ owner: this }).exec();
};

export default database.model("User", UserSchema);
