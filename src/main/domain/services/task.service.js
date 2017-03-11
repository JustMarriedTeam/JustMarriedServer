import Wedding from "../models/wedding.model";
import Task from "../models/task.model";
import forEach from "lodash/fp/forEach";
import filter from "lodash/fp/filter";
import includes from "lodash/fp/includes";
import {getFromRequestContext} from "../../context";
import { allAsObjectId } from "../../database";

const taskNotIncludedIn = function (requiredFor) {
  return (taskId) => !includes(taskId)(requiredFor);
};

function listTasks() {
  const actingUser = getFromRequestContext("user.user");
  return Wedding.findTasksBy(actingUser);
}

const updateRelations = ({taskId, oldRelations, newRelations, wedding}) => {
  const relationsToRemove = filter(taskNotIncludedIn(newRelations))(oldRelations);
  const relationsToAdd = filter(taskNotIncludedIn(oldRelations))(newRelations);

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

      updateRelations({
        taskId,
        oldRelations: requiredFor,
        newRelations: allAsObjectId(task.requiredFor),
        wedding
      });

      updateRelations({
        taskId,
        oldRelations: dependingOn,
        newRelations: allAsObjectId(task.dependingOn),
        wedding
      });

      return wedding.saveAsync()
        .then((updatedWedding) => updatedWedding.tasks);
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
