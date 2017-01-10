import googleAuthenticator from "../../../security/authenticators/google.authenticator";
import {redirectWithToken} from "../../../controllers/auth.controller";

module.exports = {
  get: [
    googleAuthenticator.recoverGoogleResponse,
    redirectWithToken
  ]
};
