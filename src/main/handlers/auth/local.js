import localAuthenticator from "../../security/authenticators/localAuthenticator";
import jwtManager from "../../security/jwt/jwtManager";

module.exports = {
    post: [
        localAuthenticator.authenticateLocally,
        jwtManager.releaseToken('local')
    ]
};