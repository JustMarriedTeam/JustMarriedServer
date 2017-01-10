import localAuthenticator from "../../security/authenticators/local.authenticator";
import { releaseToken } from "../../controllers/auth.controller";

module.exports = {
  post: [
    localAuthenticator.authenticateLocally,
    releaseToken
  ]
};
