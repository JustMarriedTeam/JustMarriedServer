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