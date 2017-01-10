import Task from "../models/task.model";
import { getFromContext } from "../context";

const DEFAULT_SORT_BY = "status name";

function listTasks(criteria) {
  const actingUser = getFromContext("user"); // wrap request's session in it and still use that...
  return Task.find()
    .select("name description status owners")
    .populate("owners", "username")
    .where("owners").in([actingUser])
    .skip(criteria.offset)
    .limit(criteria.limit)
    .sort(criteria.sortBy || DEFAULT_SORT_BY)
    .exec();
}

function createTask(taskToSave) {
  return Task.createAsync(taskToSave).then((savedTask) => savedTask.populateAsync("owners"));
}

export { listTasks, createTask };
