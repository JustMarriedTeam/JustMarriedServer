import Task from "../../main/domain/models/task.model";
import builderDecorator from "../utils/builder.decorator";
import map from "lodash/map";

const TaskBuilder = builderDecorator(Task);

function aTask(id) {
  return new TaskBuilder(id);
}

function setUpTasks(...tasks) {
  return Promise.all(map(tasks, (task) => task.saveAsync()));
}

function tearDownTasks() {
  return Task.removeAsync();
}


export {
  aTask,
  setUpTasks,
  tearDownTasks
};
