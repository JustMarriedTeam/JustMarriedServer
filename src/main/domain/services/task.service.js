import Wedding from "../models/wedding.model";
import Task from "../models/task.model";
import map from "lodash/fp/map";
import filter from "lodash/fp/filter";
import includes from "lodash/fp/includes";
import { getFromRequestContext } from "../../context";

const withConnectedDependencies = (tasks) => map((task) => {
  const dependantTasks = filter((otherTask) => includes(task.id)(otherTask.dependingOn))(tasks);
  task.requiredFor = map((dependantTask) => dependantTask.id)(dependantTasks);
  return task;
})(tasks);

function listTasks() {
  const actingUser = getFromRequestContext("user.user");
  return Wedding.findTasksBy(actingUser);
}

function createTask(taskToSave) {
  const actingUser = getFromRequestContext("user.user");
  const savedTask = new Task(taskToSave);
  return Wedding.findByOwner(actingUser)
    .then((wedding) => wedding.addTask(savedTask))
    .then(() => savedTask);
}

export { listTasks, createTask };
