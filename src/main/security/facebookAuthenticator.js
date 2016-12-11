import passport from "passport";
import FacebookStrategy from "passport-facebook";

passport.use(new FacebookStrategy({
    clientID: 'abc',
    clientSecret: 'secret',
    callbackURL: '/api/facebook/',
    profileFields: ["emails", "displayName"]
}));

exports.issueFacebookAuthenticationRequest = passport.authenticate('facebook', {session: false, scope: 'email'});
exports.recoverFacebookAuthenticationResponse = passport.authenticate('facebook', { successRedirect : '/profile', failureRedirect : '/' });