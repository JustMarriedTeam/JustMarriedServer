import googleAuthenticator from "../../security/authenticators/googleAuthenticator";

module.exports = {
    get: googleAuthenticator.issueGoogleAuthenticationRequest
};