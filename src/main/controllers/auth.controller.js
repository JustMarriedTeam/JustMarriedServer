import jwtManager from "../security/jwt/jwtManager";

function getReleasedToken(req, res) {
    let token = jwtManager.releaseToken(req.user);
    res.cookie('authToken', token.token);//.status(200).json(token);
    res.redirect(`http://localhost:3000/redirect.html?token=${token.token}`);
}

export {getReleasedToken};
