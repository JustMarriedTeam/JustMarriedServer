import localAuthenticator from "../../security/authenticators/localAuthenticator";
import { getReleasedToken } from "../../controllers/auth.controller";

module.exports = {
  post: [
    localAuthenticator.authenticateLocally,
    getReleasedToken
  ]
};
