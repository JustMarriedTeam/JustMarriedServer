import passport from "passport";
import {Strategy as JwtStrategy, ExtractJwt} from "passport-jwt";
import Account from "../../models/account.model.js";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("token"),
  secretOrKey: "serversecret"
};

passport.use(new JwtStrategy(jwtOptions, (payload, done) => {
  Account.findOneAsync({_id: payload.id})
        .then((account) => {
          if (!account) {done(null, false);} else {done(null, account);}
        }).catch((err) => done(err, false));
}));

exports.isAuthenticated = passport.authenticate("jwt", {session: false});
