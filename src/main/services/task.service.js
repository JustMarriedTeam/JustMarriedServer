import Task from "../models/task.model";
import { getFromContext } from "../context";

const DEFAULT_SORT_BY = "status name";

function listTasks(criteria) {
  const actingUser = getFromContext("user");
  return Task.find()
    .where("owners").in([actingUser])
    .skip(criteria.skip)
    .limit(criteria.limit)
    .sort(criteria.sortBy || DEFAULT_SORT_BY)
    .exec();
}

function createTask(task) {
  return Task.createAsync(task);
}

export { listTasks, createTask };
