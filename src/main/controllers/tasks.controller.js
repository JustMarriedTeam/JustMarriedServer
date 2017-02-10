import {createTask, listTasks} from "../domain/services/task.service";
import HttpStatus from "http-status";

function getTasks(req, res, done) {
  listTasks().then((tasks) => res.status(HttpStatus.OK).json(tasks))
        .catch((err) => res.status(HttpStatus.BAD_REQUEST).json(err))
        .finally(done);
}

function postTask(req, res, done) {
  createTask(req.body)
        .then((task) => res.status(HttpStatus.OK).json(task))
        .catch((err) => res.status(HttpStatus.BAD_REQUEST).json(err))
        .finally(done);
}

export {getTasks, postTask};
