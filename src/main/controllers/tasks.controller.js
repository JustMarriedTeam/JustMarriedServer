import {Task} from "../models/task.model";

function getTasks(req, res, done) {
    res.status(200).json([{
        name: 'x'
    }]);
}

export {getTasks};
