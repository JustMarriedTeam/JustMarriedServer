import jwtManager from "../security/jwt/jwtManager";
import { format } from "util";
import properties from "../properties";

const authRedirectUrl = properties.get("authRedirectUrl");

function getReleasedToken(req, res) {
  const token = jwtManager.releaseToken(req.user);
  res.cookie("authToken", token.token);//.status(200).json(token);
  res.redirect(format(authRedirectUrl, token.token));
}

export {getReleasedToken};
