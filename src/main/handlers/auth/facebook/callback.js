import facebookAuthenticator from "../../../security/authenticators/facebook.authenticator";
import {getReleasedToken} from "../../../controllers/auth.controller";

module.exports = {
  get: [
    facebookAuthenticator.recoverFacebookAuthenticationResponse,
    getReleasedToken
  ]
};
