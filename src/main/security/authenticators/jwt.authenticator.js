import passport from "passport";
import {Strategy as JwtStrategy, ExtractJwt} from "passport-jwt";
import Account from "../../models/account.model.js";
import { runInContext, setInContext } from "../../context";


const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("token"),
  secretOrKey: "serversecret"
};

passport.use(new JwtStrategy(jwtOptions, (payload, done) => {
  Account.findOne({_id: payload.id})
    .populate("user")
    .exec()
        .then((account) => {
          if (!account) {done(null, false);} else {
            runInContext(() => {
              setInContext("user", account.user);
              done(null, account);
            });
          }
        }).catch((err) => done(err, false));
}));

exports.isAuthenticated = passport.authenticate("jwt", {session: false});
