import Account from "../models/account.model";

function createAccount(credentials) {
    return Account.findOneAsync({'login': credentials.login})
        .then((account) => {
            if (!!account) throw 'Account already exists';
        })
        .then(() => {
            var account = new Account();
            account.login = credentials.login;
            account.password = credentials.password;
            return account.saveAsync().then(() => account);
        });
}

export {createAccount}

//https://mtcasey.com/blog/how-to-add-nodejs-promises-bluebird

