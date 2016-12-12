import jwt from "jsonwebtoken";
import Account from "../../models/account.model";

function generateToken(userId) {
    return jwt.sign({
        id: userId,
    }, 'server secret', {
        expiresInMinutes: 120
    });
}

function serialize(type, rawId) {
    switch (type) {
        case 'local':
            return Account.findOne({'login': rawId}, 'id');
        case 'facebook':
            return Account.findOne({'external.facebook.id': rawId}, 'id');
        default:
            throw `Authentication method ${type} is not supported`;
    }
}

module.exports.releaseToken = function (type) {
    return function (req, res) {
        const userId = serialize(type, req.id);
        let token = generateToken(userId);
        res.status(200).json({
            login: userId,
            token: token
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


