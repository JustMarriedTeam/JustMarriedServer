import {createAccount} from "../services/account.service";

function postAccount(req, res, done) {
    createAccount({
        login: req.body.login,
        password: req.body.password
    }).then((account) => res.status(200).json({
        login: account.login
    })).catch((err) => res.status(400).json({
        message: "Cannot create account"
    })).finally(done);
}

export {postAccount};
