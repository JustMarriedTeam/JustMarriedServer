import facebookAuthenticator from "../../../security/authenticators/facebookAuthenticator";
import jwtManager from '../../../security/jwt/jwtManager'

module.exports = {
    get: [
        facebookAuthenticator.recoverFacebookAuthenticationResponse,
        jwtManager.releaseToken
    ]
};