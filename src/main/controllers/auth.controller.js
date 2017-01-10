import jwtManager from "../security/jwt/jwt.manager";
import { format } from "util";
import properties from "../properties";
import HttpStatus from "http-status";

// this can be removed - get redirect url from session
const authRedirectUrl = properties.get("authRedirectUrl");

function releaseToken(req, res) {
  const token = jwtManager.releaseToken(req.user);
  res.status(HttpStatus.OK).json(token);
}

function redirectWithToken(req, res) {
  const token = jwtManager.releaseToken(req.user);
  res.cookie("authToken", token.token);
  res.redirect(format(authRedirectUrl, token.token));
}

export { releaseToken, redirectWithToken };
