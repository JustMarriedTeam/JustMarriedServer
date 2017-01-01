import Promise from "bluebird";
import Task, { TASK_STATUS } from "../../main/models/task.model";
import map from "lodash/map";

const redTask = new Task({
  name: "red task",
  description: "a red task",
  status: TASK_STATUS.BLOCKED
});

const greenTask = new Task({
  name: "green task",
  description: "a green task",
  status: TASK_STATUS.PENDING
});

const blueTask = new Task({
  name: "blue task",
  description: "a blue task",
  status: TASK_STATUS.DONE
});

const blackTask = new Task({
  name: "black task",
  description: "a black task",
  status: TASK_STATUS.BLOCKED
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
  blackTask,
  setUpTasks,
  tearDownTasks
};
