import passport from 'passport'
import LocalStrategy from 'passport-local'
import Account from '../../models/account.model.js'

passport.use(new LocalStrategy({
        usernameField: 'login',
        passwordField: 'password',
        session: false
    },
    function (login, password, callback) {
        Account.findOne({login: login}, function (err, account) {
            if (err) return done(err);
            if (!account) return done(null, false);
            if (!account.isPasswordValid(password)) return done(null, false);
            return callback(null, account);
        });
    }
));

exports.authenticateLocally = passport.authenticate('local', {session: false});