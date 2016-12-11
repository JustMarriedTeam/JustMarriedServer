import facebookAuthenticator from "../../security/authenticators/facebookAuthenticator";
import jwtManager from "../../security/jwt/jwtManager";

module.exports = {
    get: facebookAuthenticator.issueFacebookAuthenticationRequest,
    post: [
        facebookAuthenticator.recoverFacebookAuthenticationResponse,
        jwtManager.releaseToken('facebook')
    ]
};