import facebookAuthenticator from "../../../security/authenticators/facebookAuthenticator";
import {getReleasedToken} from "../../../controllers/auth.controller";

module.exports = {
    get: [
        facebookAuthenticator.recoverFacebookAuthenticationResponse,
        getReleasedToken
    ]
};