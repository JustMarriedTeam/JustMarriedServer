import { getUsers, postUser } from "../controllers/user.controller";

module.exports = {
  get: getUsers,
  post: postUser
};
