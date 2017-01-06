import passport from "passport";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import { SERVER_URI } from "../../server";
import { bindToAccount } from "../../services/account.service";

// https://console.developers.google.com/apis/credentials?project=justwedding-76fa3
passport.use(new GoogleStrategy({
  clientID: "646826684984-prh2of3329duldfi9mrkbrluubobnl90.apps.googleusercontent.com",
  clientSecret: "K6hMRrdjx_pzxXWYjVhOPZWS",
  callbackURL: `${SERVER_URI}/api/auth/google/callback`
}, (accessToken, refreshToken, profile, done) => // eslint-disable-line

    bindToAccount({
      "google": {
        id: profile.id,
        token: accessToken,
        name: profile.displayName,
        email: profile.emails[0].value
      }
    }).then((savedAccount) => done(null, savedAccount))

));

exports.issueGoogleAuthenticationRequest = passport.authenticate("google", {
  scope: ["profile", "email"],
  session: false,
  display: "popup"
});

exports.recoverGoogleAuthenticationResponse = passport.authenticate("google", {
  failureRedirect: "/api/error",
  session: false
});
