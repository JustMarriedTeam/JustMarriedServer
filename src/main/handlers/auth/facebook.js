import facebookAuthenticator from "../../security/facebookAuthenticator";

module.exports = {
    get: facebookAuthenticator.issueFacebookAuthenticationRequest,
    post: facebookAuthenticator.recoverFacebookAuthenticationResponse
};