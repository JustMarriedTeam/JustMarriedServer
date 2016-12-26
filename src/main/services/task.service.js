import Task from '../models/task.model';

function listTasks(criteria) {
    return Task.find()
        .skip(criteria.skip || 0)
        .limit(criteria.limit || 1000)
        .exec();
}

function createTask(task) {
    return Task.createAsync(task);
}

export { listTasks, createTask }