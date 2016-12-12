import passport from "passport";
import {Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import Account from "../../models/account.model.js";

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('Token'),
    secretOrKey: 'secret'
};

passport.use(new JwtStrategy(jwtOptions, function (payload, done) {
    Account.findOne({id: payload.userId}, function (err, user) {
        if (err) return done(err, false);
        else if (user) done(null, user);
        else done(null, false);

    });
}));

exports.isAuthenticated = passport.authenticate('jwt', {session: false});