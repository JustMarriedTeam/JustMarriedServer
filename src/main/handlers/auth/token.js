import jwtManager from "../../security/jwt/jwtManager";

module.exports = {
    get: [
        jwtManager.isAuthenticated,
        jwtManager.releaseToken('local')
    ]
};