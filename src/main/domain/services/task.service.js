import Wedding from "../models/wedding.model";
import Task from "../models/task.model";
import forEach from "lodash/fp/forEach";
import filter from "lodash/fp/filter";
import extend from "lodash/extend";
import omit from "lodash/omit";
import find from "lodash/fp/find";
import {getFromRequestContext} from "../../context";
import {asObjectId, allAsObjectId} from "../../database";

const taskNotIncludedIn = function (taskList) {
  return (taskId) => !find((comparedTaskId) => taskId.equals(comparedTaskId))(taskList);
};

function listTasks() {
  const actingUser = getFromRequestContext("user.user");
  return Wedding.findTasksBy(actingUser);
}

const updateRelations = ({type, taskId, oldRelations, newRelations, wedding}) => {
  const relationsToRemove = filter(taskNotIncludedIn(newRelations))(oldRelations);
  const relationsToAdd = filter(taskNotIncludedIn(oldRelations))(newRelations);

  forEach((unrelatedTaskId) => wedding.tasks.id(unrelatedTaskId)[type]
    .remove(taskId))(relationsToRemove);
  forEach((relatedTaskId) => wedding.tasks.id(relatedTaskId)[type]
    .push(taskId))(relationsToAdd);
};

const removeRelations = ({ relationType, taskId, wedding }) => {
  const relationsToRemove = filter((task) => !!find((comparedTaskId) =>
    taskId.equals(comparedTaskId))(task[relationType]))(wedding.tasks);

  forEach((noLongerRelatedTaskId) => wedding.tasks.id(noLongerRelatedTaskId)[relationType]
    .remove(taskId))(relationsToRemove);
};

function updateTask(taskId, task) {
  const actingUser = getFromRequestContext("user.user");
  return Wedding.findByOwner(actingUser, "tasks").then((wedding) => {
    const updatedTask = wedding.tasks.id(taskId);
    if (updatedTask) {
      const {dependingOn, requiredFor} = updatedTask;

      updateRelations({
        taskId,
        type: "dependingOn",
        oldRelations: requiredFor,
        newRelations: allAsObjectId(task.requiredFor),
        wedding
      });

      updateRelations({
        taskId,
        type: "requiredFor",
        oldRelations: dependingOn,
        newRelations: allAsObjectId(task.dependingOn),
        wedding
      });

      extend(updatedTask, omit(task, "id"));

      return wedding.saveAsync()
        .then((updatedWedding) => updatedWedding.tasks.id(taskId));
    } else {
      throw Error("Task does not exist");
    }
  });
}

function createTask(taskToSave) {
  const actingUser = getFromRequestContext("user.user");
  const savedTask = new Task(taskToSave);

  return Wedding.findByOwner(actingUser, "tasks")
    .then((wedding) => wedding.addTask(savedTask))
    .then((wedding) => {

      updateRelations({
        taskId: savedTask.id,
        type: "dependingOn",
        oldRelations: [],
        newRelations: allAsObjectId(taskToSave.requiredFor),
        wedding
      });

      updateRelations({
        taskId: savedTask.id,
        type: "requiredFor",
        oldRelations: [],
        newRelations: allAsObjectId(taskToSave.dependingOn),
        wedding
      });

      return wedding;
    }).then((wedding) => wedding.saveAsync())
    .then(() => savedTask);
}

function removeTask(taskId) {
  const actingUser = getFromRequestContext("user.user");
  return Wedding.findByOwner(actingUser, "tasks")
    .then((wedding) => wedding.removeTask(taskId))
    .then((wedding) => {

      removeRelations({
        taskId: asObjectId(taskId),
        wedding,
        relationType: "dependingOn"
      });

      removeRelations({
        taskId: asObjectId(taskId),
        wedding,
        relationType: "requiredFor"
      });

      return wedding;
    })
    .then((wedding) => wedding.saveAsync());
}

export {listTasks, updateTask, createTask, removeTask};
