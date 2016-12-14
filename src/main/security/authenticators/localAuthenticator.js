import passport from "passport";
import LocalStrategy from "passport-local";
import Account from "../../models/account.model.js";

passport.use(new LocalStrategy({
        usernameField: 'login',
        passwordField: 'password',
        session: false
    },
    function (login, password, done) {
        Account.findOneAsync({login: login})
            .then((account) => {
                if (!account) return done(null, false);
                else if (!account.isPasswordValid(password)) return done(null, false);
                else done(null, account);
            }).catch((err) => done(err));
    }
));

exports.authenticateLocally = passport.authenticate('local', {
    session: false
});