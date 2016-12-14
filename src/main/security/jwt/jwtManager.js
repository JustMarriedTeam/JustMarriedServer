import jwt from "jsonwebtoken";

function generateToken(userId) {
    return jwt.sign({id: userId}, 'serversecret', {expiresIn: 3600});
}

module.exports.releaseToken = function (account) {
    let token = generateToken(account.id);
    return {
        token: token
    }
};

//http://mongoosejs.com/docs/queries.html
//https://github.com/themikenicholson/passport-jwt
//https://blog.hyphe.me/token-based-authentication-with-node/
//https://github.com/jaredhanson/passport-local
//https://github.com/scottksmith95/beerlocker/blob/master/beerlocker-3.2/server.js
//http://scottksmith.com/blog/2014/05/29/beer-locker-building-a-restful-api-with-node-passport/
//https://scotch.io/tutorials/easy-node-authentication-facebook


