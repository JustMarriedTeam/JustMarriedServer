import passport from "passport";
import FacebookStrategy from "passport-facebook";

passport.use(new FacebookStrategy({
    clientID: '1806015219657884',
    clientSecret: '1e9d67e72737902cce62420e268d5a82',
    callbackURL: '/api/facebook/',
    profileFields: ["emails", "displayName"]
}));

exports.issueFacebookAuthenticationRequest = passport.authenticate('facebook', {session: false, scope: 'email'});
exports.recoverFacebookAuthenticationResponse = passport.authenticate('facebook', { successRedirect : '/profile', failureRedirect : '/' });