import Promise from "bluebird";
import Task, { TASK_STATUS } from "../../main/models/task.model";
import map from "lodash/map";
import builderDecorator from "../utils/builder.decorator";

const TaskBuilder = builderDecorator(Task);

function setUpTasks(...tasks) {
  return Promise.all(map(tasks, (task) => task.saveAsync()));
}

function tearDownTasks() {
  return Task.removeAsync();
}

function aBlackTask() {
  return new TaskBuilder()
    .withName("black task")
    .withDescription("a black task")
    .withStatus(TASK_STATUS.BLOCKED);
}

function aBlueTask() {
  return new TaskBuilder()
    .withName("blue task")
    .withDescription("a blue task")
    .withStatus(TASK_STATUS.DONE);
}

function aGreenTask() {
  return new TaskBuilder()
    .withName("green task")
    .withDescription("a green task")
    .withStatus(TASK_STATUS.PENDING);
}

function aRedTask() {
  return new TaskBuilder()
    .withName("red task")
    .withDescription("a red task")
    .withStatus(TASK_STATUS.BLOCKED);
}

export {
  aRedTask,
  aGreenTask,
  aBlueTask,
  aBlackTask,
  setUpTasks,
  tearDownTasks
};
