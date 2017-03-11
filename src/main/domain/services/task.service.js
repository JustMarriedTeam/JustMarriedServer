import Wedding from "../models/wedding.model";
import Task from "../models/task.model";
import forEach from "lodash/fp/forEach";
import filter from "lodash/fp/filter";
import includes from "lodash/fp/includes";
import {getFromRequestContext} from "../../context";


const includesTask = function (requiredFor) {
  return (taskId) => includes(taskId)(requiredFor);
};

function listTasks() {
  const actingUser = getFromRequestContext("user.user");
  return Wedding.findTasksBy(actingUser);
}

const updateRelations = ({taskId, oldRelations, newRelations, wedding}) => {
  const relationsToRemove = filter(includesTask(newRelations))(oldRelations);
  const relationsToAdd = filter(!includesTask(newRelations))(oldRelations);

  forEach((noLongerDependentTaskId) => wedding.tasks.id(noLongerDependentTaskId)
    .dependingOn.remove(taskId))(relationsToRemove);
  forEach((newDependentTaskId) => wedding.tasks.id(newDependentTaskId)
    .dependingOn.push(taskId))(relationsToAdd);
};

function updateTask(taskId, task) {
  const actingUser = getFromRequestContext("user.user");
  return Wedding.findByOwner(actingUser, "tasks").then((wedding) => {
    const updatedTask = wedding.tasks.id(taskId);
    if (updatedTask) {
      const {dependingOn, requiredFor} = updatedTask;

      updateRelations({oldRelations: requiredFor, newRelations: task.requiredFor, taskId});
      updateRelations({oldRelations: dependingOn, newRelations: task.dependingOn, taskId});

      return wedding.saveAsync();
    } else {
      throw Error("Task does not exist");
    }
  });
}

function createTask(taskToSave) {
  const actingUser = getFromRequestContext("user.user");
  const savedTask = new Task(taskToSave);
  return Wedding.findByOwner(actingUser)
    .then((wedding) => wedding.addTask(savedTask))
    .then(() => savedTask);
}

export {listTasks, updateTask, createTask};
