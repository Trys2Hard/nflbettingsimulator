const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        required: false
    },
    spentMoney: {
        type: Number,
        defalut: 0
    },
    isVerified: {
        type: Boolean,
        defalut: false
    },
    emailToken: {
        type: String
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);