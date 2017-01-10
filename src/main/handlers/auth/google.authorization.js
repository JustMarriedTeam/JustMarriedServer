import googleAuthenticator from "../../security/authenticators/google.authenticator";

module.exports = {
  get: googleAuthenticator.issueGoogleAuthorizationRequest
};
