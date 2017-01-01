import database from "../database";
import Task from "./task.model";

const UserSchema = new database.Schema({
  firstName: String,
  lastName: String,
  status: String,
  tasks: [{
    type: database.Schema.ObjectId,
    ref: Task.modelName
  }]
});

export default database.model("User", UserSchema);
