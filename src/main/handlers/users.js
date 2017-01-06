import { listUsers } from "../controllers/user.controller";

module.exports = {
  get: listUsers,
  post(req, res) {
    res.json({"created": true});
  }
};
