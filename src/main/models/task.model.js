import mongoose from "mongoose";
import pick from "lodash/pick";


const TaskSchema = new mongoose.Schema({
  name: String,
  description: String,
  status: String
});

TaskSchema.method({
  toJSON() {
    return pick(this.toObject(), ["name", "status"]);
  }
});


export default mongoose.model("Task", TaskSchema);
