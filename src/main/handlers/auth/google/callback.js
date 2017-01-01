import googleAuthenticator from "../../../security/authenticators/google.authenticator";
import {getReleasedToken} from "../../../controllers/auth.controller";

module.exports = {
  get: [
    googleAuthenticator.recoverGoogleAuthenticationResponse,
    getReleasedToken
  ]
};
