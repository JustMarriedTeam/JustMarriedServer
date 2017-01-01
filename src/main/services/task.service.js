import Task from "../models/task.model";

function listTasks(criteria) {
  return Task.find()
        .skip(criteria.skip)
        .limit(criteria.limit)
        .exec();
}

function createTask(task) {
  return Task.createAsync(task);
}

export { listTasks, createTask };
