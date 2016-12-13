import jwtManager from "../../security/jwt/jwtManager";
import { getReleasedToken } from "../../controllers/auth.controller";

module.exports = {
    get: [
        jwtManager.isAuthenticated,
        getReleasedToken
    ]
};