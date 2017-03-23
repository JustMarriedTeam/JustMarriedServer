import {createTask, updateTask, removeTask, listTasks} from "../domain/services/task.service";
import HttpStatus from "http-status";
import omit from "lodash/omit";

function getTasks(req, res, done) {
  listTasks().then((tasks) => res.status(HttpStatus.OK).json(tasks))
        .catch((err) => res.status(HttpStatus.BAD_REQUEST).json(err))
        .finally(done);
}

function postTask(req, res, done) {
  createTask(omit(req.body, ["_id"]))
        .then((task) => res.status(HttpStatus.OK).json(task))
        .catch((err) => res.status(HttpStatus.BAD_REQUEST).json(err))
        .finally(done);
}

function putTask(req, res, done) {
  updateTask(req.param("taskId"), req.body)
    .then((task) => res.status(HttpStatus.OK).json(task))
    .catch((err) => res.status(HttpStatus.BAD_REQUEST).json(err))
    .finally(done);
}

function deleteTask(req, res, done) {
  removeTask(req.param("taskId"))
    .then(() => res.status(HttpStatus.NO_CONTENT).json({}))
    .catch((err) => res.status(HttpStatus.BAD_REQUEST).json(err))
    .finally(done);
}

export {getTasks, postTask, putTask, deleteTask};
