import passport from "passport";
import FacebookStrategy from "passport-facebook";
import Account from "../../models/account.model";
import {SERVER_URI} from "../../server";
import {bindOrCreate} from "../../services/account.service";

passport.use(new FacebookStrategy({
  clientID: "1806015219657884",
  clientSecret: "1e9d67e72737902cce62420e268d5a82",
  callbackURL: `${SERVER_URI}/api/auth/facebook/callback`,
  profileFields: ["emails", "displayName", "name"],
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => // eslint-disable-line
  bindOrCreate("facebook", {
    id: profile.id,
    token: accessToken,
    name: `${profile.name.givenName} ${profile.name.familyName}`,
    email: profile.emails[0].value
  }, req.user).then((account) => done(null, account))
));

exports.issueFacebookAuthenticationRequest = passport.authenticate("facebook", {
  scope: "email",
  display: "popup"
});

exports.issueFacebookAuthorizationRequest = passport.authorize("facebook", {
  scope: "email",
  display: "popup"
});

exports.recoverFacebookResponse = passport.authenticate("facebook", {
  failureRedirect: "/api/error"
});
