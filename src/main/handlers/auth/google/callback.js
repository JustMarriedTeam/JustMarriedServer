import googleAuthenticator from "../../../security/authenticators/googleAuthenticator";
import {getReleasedToken} from "../../../controllers/auth.controller";

module.exports = {
    get: [
        googleAuthenticator.recoverGoogleAuthenticationResponse,
        getReleasedToken
    ]
};