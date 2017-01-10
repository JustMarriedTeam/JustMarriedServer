import facebookAuthenticator from "../../../security/authenticators/facebook.authenticator";
import {redirectWithToken} from "../../../controllers/auth.controller";

module.exports = {
  get: [
    facebookAuthenticator.recoverFacebookResponse,
    redirectWithToken
  ]
};
