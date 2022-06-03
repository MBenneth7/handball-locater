//DETERMINING WHAT WE WANT OUR USER DATA TO CONTAIN

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = {
    username: String,
    email: String,
    password: String
};

module.exports = mongoose.model('User', UserSchema);