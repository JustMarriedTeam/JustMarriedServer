import passport from "passport";
import {OAuth2Strategy as GoogleStrategy} from "passport-google-oauth";
import {SERVER_URI} from "../../server";
import {bindOrCreate} from "../../domain/services/account.service";

// https://console.developers.google.com/apis/credentials?project=justwedding-76fa3
passport.use(new GoogleStrategy({
  clientID: "646826684984-prh2of3329duldfi9mrkbrluubobnl90.apps.googleusercontent.com",
  clientSecret: "K6hMRrdjx_pzxXWYjVhOPZWS",
  callbackURL: `${SERVER_URI}/api/auth/google/callback`,
  passReqToCallback: true
  }, (req, accessToken, refreshToken, profile, done) => // eslint-disable-line
    bindOrCreate("google", {
      id: profile.id,
      token: accessToken,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      email: profile.emails[0].value
    }, req.user)
      .then((account) => done(null, account))
      .catch(() => done("Could not authenticate"))
));

exports.issueGoogleAuthenticationRequest = passport.authenticate("google", {
  scope: ["profile", "email"],
  display: "popup"
});

exports.issueGoogleAuthorizationRequest = passport.authorize("google", {
  scope: ["profile", "email"],
  display: "popup"
});

exports.recoverGoogleResponse = passport.authenticate("google", {
  failureRedirect: "/api/error"
});
