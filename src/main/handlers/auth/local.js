import localAuthenticator from "../../security/authenticators/local.authenticator";
import { getReleasedToken } from "../../controllers/auth.controller";

module.exports = {
  post: [
    localAuthenticator.authenticateLocally,
    getReleasedToken
  ]
};
