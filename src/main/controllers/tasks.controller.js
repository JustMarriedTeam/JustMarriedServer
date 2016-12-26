import {Task} from "../models/task.model";
import { createTask, listTasks } from '../services/task.service'

function getTasks(req, res, done) {
    listTasks(req.query).then((tasks) => res.status(200).json(tasks))
        .catch((err) => res.status(400).json(err))
        .finally(done);
}

function postTask(req, res, done) {
    createTask(req.body)
        .then((task) => res.status(200).json(task))
        .catch((err) => res.status(400).json(err))
        .finally(done);
}

export {getTasks, postTask};
