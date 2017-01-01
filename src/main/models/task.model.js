import database from "../database";
import pick from "lodash/pick";


const TaskSchema = new database.Schema({
  name: String,
  description: String,
  status: String
});

TaskSchema.method({
  toJSON() {
    return pick(this.toObject(), ["name", "status"]);
  }
});


export default database.model("Task", TaskSchema);
