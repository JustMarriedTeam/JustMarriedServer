import jwtManager from '../security/jwt/jwtManager';

function getReleasedToken(req, res) {
  let token = jwtManager.releaseToken(req.user);
  res.status(200).json({
    token: token
  });
}

export { getReleasedToken };
