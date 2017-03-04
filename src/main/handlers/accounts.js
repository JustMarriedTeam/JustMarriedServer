import { getAccount, postAccount } from "../controllers/account.controller";

module.exports = {
  post: postAccount,
  get: getAccount
};
