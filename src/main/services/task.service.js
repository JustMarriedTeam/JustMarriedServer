import Wedding from "../models/wedding.model";
import { getFromRequestContext } from "../context";

function listTasks() {
  const actingUser = getFromRequestContext("user.user");
  return Wedding.findOne()
    .select("tasks")
    .where("owners").in([actingUser])
    .exec();
}

function createTask(taskToSave) {
  // return Task.createAsync(taskToSave).then((savedTask) => savedTask.populateAsync("owners"));
}

export { listTasks, createTask };
