import Promise from "bluebird";
import Task, { TASK_STATUS } from "../../main/models/task.model";
import map from "lodash/map";

const redTask = new Task({
  name: "red task",
  description: "a blue task",
  status: TASK_STATUS.BLOCKED
});

const greenTask = new Task({
  name: "green task",
  description: "a blue task",
  status: TASK_STATUS.PENDING
});

const blueTask = new Task({
  name: "blue task",
  description: "a blue task",
  status: TASK_STATUS.DONE
});

function setUpTasks(...tasks) {
  return Promise.all(map(tasks, (task) => task.saveAsync()));
}

function tearDownTasks() {
  return Task.removeAsync();
}

export {
  redTask,
  greenTask,
  blueTask,
  setUpTasks,
  tearDownTasks
};
