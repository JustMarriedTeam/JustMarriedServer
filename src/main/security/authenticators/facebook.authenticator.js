import passport from "passport";
import FacebookStrategy from "passport-facebook";
import Account from "../../models/account.model";
import {SERVER_URI} from "../../server";

passport.use(new FacebookStrategy({
  clientID: "1806015219657884",
  clientSecret: "1e9d67e72737902cce62420e268d5a82",
  callbackURL: `${SERVER_URI}/api/auth/facebook/callback`,
  profileFields: ["emails", "displayName", "name"]
}, (accessToken, refreshToken, profile, done) => { // eslint-disable-line
  Account.findOne({"external.facebook.id": profile.id}, (err, account) => {
    if (err) {
      return done(err);
    } else if (account) {
      return done(null, account);
    } else {
      account = new Account();
      account.external.facebook.id = profile.id;
      account.external.facebook.token = accessToken;
      account.external.facebook.name = `${profile.name.givenName} ${profile.name.familyName}`;
      account.external.facebook.email = profile.emails[0].value;

      return account.save((savingErr) => {
        if (savingErr) {
          throw savingErr;
        } else {
          return done(null, account);
        }
      });
    }
  });
}));

exports.issueFacebookAuthenticationRequest = passport.authenticate("facebook", {
  scope: "email",
  session: false,
  display: "popup"
});

exports.recoverFacebookAuthenticationResponse = passport.authenticate("facebook", {
  failureRedirect: "/api/error",
  session: false
});
