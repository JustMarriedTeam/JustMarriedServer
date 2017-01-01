import passport from "passport";
import LocalStrategy from "passport-local";
import Account from "../../models/account.model.js";

passport.use(new LocalStrategy({
  usernameField: "login",
  passwordField: "password",
  session: false
}, (login, password, done) => {
  Account.findOneAsync({login})
      .then((account) => {
        if (!account) {
          return done(null, false);
        } else if (!account.isPasswordValid(password)) {
          return done(null, false);
        } else {
          return done(null, account);
        }
      }).catch((err) => done(err));
}
));

exports.authenticateLocally = passport.authenticate("local", {
  session: false
});
