import facebookAuthenticator from "../../security/authenticators/facebook.authenticator";

module.exports = {
  get: facebookAuthenticator.issueFacebookAuthenticationRequest
};
