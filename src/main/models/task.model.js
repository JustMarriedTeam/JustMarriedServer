import database from "../database";
import pick from "lodash/pick";
import values from "lodash/values";

const TASK_STATUS = {
  PENDING: "pending",
  BLOCKED: "blocked",
  DONE: "done"
};

const TaskSchema = new database.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  owners: [ { type: database.Schema.ObjectId, ref: "User" } ],
  status: {
    type: String,
    enum: values(TASK_STATUS),
    required: true
  }
});

TaskSchema.method({
  toJSON() {
    return pick(this.toObject(), ["name", "status"]);
  }
});

export { TASK_STATUS };
export default database.model("Task", TaskSchema);
