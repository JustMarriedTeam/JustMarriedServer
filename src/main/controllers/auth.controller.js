import jwtManager from "../security/jwt/jwtManager";
import { format } from 'util';
import properties from '../properties'

function getReleasedToken(req, res) {
    let token = jwtManager.releaseToken(req.user);
    res.cookie('authToken', token.token);//.status(200).json(token);
    res.redirect(format(properties.authRedirectUrl, token.token));
}

export {getReleasedToken};
