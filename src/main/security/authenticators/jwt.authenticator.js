import passport from "passport";
import {Strategy as JwtStrategy, ExtractJwt} from "passport-jwt";
import Account from "../../models/account.model.js";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromHeader("token"),
    ExtractJwt.fromUrlQueryParameter("token")
  ]),
  secretOrKey: "serversecret"
};

passport.use(new JwtStrategy(jwtOptions, (payload, done) => {
  Account.findOne({_id: payload.id})
    .populate("user")
    .exec()
        .then((account) => {
          if (!account) {
            done(null, false);
          } else {
            done(null, account);
          }
        }).catch((err) => done(err, false));
}));

exports.requireAuthentication = passport.authenticate("jwt");
