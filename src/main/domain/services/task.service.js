import Wedding from "../models/wedding.model";
import Task from "../models/task.model";
import { getFromRequestContext } from "../../context";

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
