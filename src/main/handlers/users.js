import { getUsers } from "../controllers/user.controller";

module.exports = {
  get: getUsers,
  post(req, res) {
    res.json({"created": true});
  }
};
