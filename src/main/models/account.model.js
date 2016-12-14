import mongoose from "mongoose";
import bcrypt from 'bcrypt-nodejs'

const AccountSchema = new mongoose.Schema({
    login: {
        type: String,
        index: true,
    },
    password: {
        type: String,
        match: [/^.*$/, 'The value of path {PATH} ({VALUE}) is not a valid password!']
    },
    external: {
        facebook: {
            id: String,
            token: String,
            email: String,
            name: String
        },
        twitter: {
            id: String,
            token: String,
            displayName: String,
            username: String
        },
        google: {
            id: String,
            token: String,
            email: String,
            name: String
        }
    }
});

AccountSchema.methods.setPassword = function (password) {
    this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

AccountSchema.methods.isPasswordValid = function (password) {
    return bcrypt.compareSync(password, this.password);
};

export default mongoose.model('Account', AccountSchema);
