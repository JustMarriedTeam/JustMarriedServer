import facebookAuthenticator from "../../security/authenticators/facebookAuthenticator";

module.exports = {
    get: facebookAuthenticator.issueFacebookAuthenticationRequest
};