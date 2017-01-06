import passport from "passport";
import FacebookStrategy from "passport-facebook";
import {SERVER_URI} from "../../server";
import { bindToAccount } from "../../services/account.service";

passport.use(new FacebookStrategy({
  clientID: "1806015219657884",
  clientSecret: "1e9d67e72737902cce62420e268d5a82",
  callbackURL: `${SERVER_URI}/api/auth/facebook/callback`,
  profileFields: ["emails", "displayName", "name"]
}, (accessToken, refreshToken, profile, done) => // eslint-disable-line
  bindToAccount({
    "facebook": {
      id: profile.id,
      token: accessToken,
      name: `${profile.name.givenName} ${profile.name.familyName}`,
      email: profile.emails[0].value
    }
  }).then((savedAccount) => done(null, savedAccount))
));

exports.issueFacebookAuthenticationRequest = passport.authenticate("facebook", {
  scope: "email",
  session: false,
  display: "popup"
});

exports.recoverFacebookAuthenticationResponse = passport.authenticate("facebook", {
  failureRedirect: "/api/error",
  session: false
});
