import Task from "../models/task.model";
import { getFromRequestContext } from "../context";

const DEFAULT_SORT_BY = "status name";

function listTasks(criteria) {
  const actingUser = getFromRequestContext("user");
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
