import { getWedding, postWedding, putWedding } from "../controllers/wedding.controller";

module.exports = {
  get: getWedding,
  post: postWedding,
  put: putWedding
};
