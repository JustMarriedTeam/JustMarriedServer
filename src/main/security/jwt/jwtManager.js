import jwt from "jsonwebtoken";
import jwtAuthenticator from "../authenticators/jwtAuthenticator";
import Account from "../../models/account.model";

function generateToken(userId) {
    return jwt.sign({id: userId}, 'serversecret', {expiresIn: 3600});
}

function findAccountFor(type, rawId, done) {
    switch (type) {
        case 'local':
            Account.findOne({'login': rawId}, 'id').exec().then(done);
            break;
        case 'facebook':
            Account.findOne({'external.facebook.id': rawId}, 'id').exec().then(done);
            break;
        default:
            throw `Authentication method ${type} is not supported`;
            done();
    }
}

module.exports.isAuthenticated = jwtAuthenticator.isAuthenticated;
module.exports.releaseToken = function (type) {
    return function (req, res) {
        console.log(`Releasing token for ${req}`);
        findAccountFor(type, req.id, function (account) {
            let token = generateToken(account.id);
            res.status(200).json({
                token: token
            });
        });
    }
};

//http://mongoosejs.com/docs/queries.html
//https://github.com/themikenicholson/passport-jwt
//https://blog.hyphe.me/token-based-authentication-with-node/
//https://github.com/jaredhanson/passport-local
//https://github.com/scottksmith95/beerlocker/blob/master/beerlocker-3.2/server.js
//http://scottksmith.com/blog/2014/05/29/beer-locker-building-a-restful-api-with-node-passport/
//https://scotch.io/tutorials/easy-node-authentication-facebook


