import passport from "passport";
import {Strategy as JwtStrategy, ExtractJwt} from "passport-jwt";
import Account from "../../models/account.model.js";
import { bindToContext } from "../../context";

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromHeader("token"),
    ExtractJwt.fromUrlQueryParameter("token")
  ]),
  secretOrKey: "serversecret"
}, (payload, done) => {
  Account.findOne({_id: payload.id})
    .exec()
        .then(bindToContext((account) => {
          if (!account) {
            done(null, false);
          } else {
            done(null, account);
          }
        })).catch((err) => done(err, false));
}));

exports.requireAuthentication = passport.authenticate("jwt");
