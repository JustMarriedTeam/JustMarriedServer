import localAuthenticator from '../../security/localAuthenticator'

module.exports = {
    post: localAuthenticator.authenticateLocally
};