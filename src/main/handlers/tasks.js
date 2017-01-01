import { getTasks, postTask } from "../controllers/tasks.controller";

module.exports = {
  get: getTasks,
  post: postTask
};
