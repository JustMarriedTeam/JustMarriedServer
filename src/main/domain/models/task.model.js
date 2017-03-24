import database from "../../database";
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
  status: {
    type: String,
    enum: values(TASK_STATUS),
    required: true
  },
  dependingOn: [{ type: database.Schema.Types.ObjectId, ref: "Task" }],
  requiredFor: [{ type: database.Schema.Types.ObjectId, ref: "Task" }],
  deadlineDate: {
    type: Date,
    required: false
  },
  completionDate: {
    type: Date,
    required: false
  }
});

export { TASK_STATUS, TaskSchema };
export default database.model("Task", TaskSchema);
