import Task from "../models/task.model";

const DEFAULT_SORT_BY = "status name";

function listTasks(criteria) {
  return Task.find()
    .skip(criteria.skip)
    .limit(criteria.limit)
    .sort(criteria.sortBy || DEFAULT_SORT_BY)
    .exec();
}

function createTask(task) {
  return Task.createAsync(task);
}

export { listTasks, createTask };
