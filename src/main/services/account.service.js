import Account from "../models/account.model";

function createAccount(credentials) {
    return Account.findOneAsync({'login': credentials.login})
        .then((account) => {
            if (!!account) throw 'Account already exists';
        })
        .then(() => {
            var account = new Account();
            account.login = credentials.login;
            account.setPassword(credentials.password);
            return account.saveAsync().then(() => account);
        });
}

export {createAccount}

