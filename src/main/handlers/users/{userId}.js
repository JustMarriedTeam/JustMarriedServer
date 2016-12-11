import jwtAuthenticator from "../../security/jwtAuthenticator";

module.exports = {
    get: [
        jwtAuthenticator.isAuthenticated,
        function (req, res) {
            return res.json({'a': 'b'});
        }
    ]
};