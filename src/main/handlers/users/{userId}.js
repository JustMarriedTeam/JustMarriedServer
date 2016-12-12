import jwtAuthenticator from "../../security/jwt/jwtManager";

module.exports = {
    get: [
        jwtAuthenticator.isAuthenticated,
        function (req, res) {
            return res.json({'a': 'b'});
        }
    ]
};