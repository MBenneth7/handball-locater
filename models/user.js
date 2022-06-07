//DETERMINING WHAT WE WANT OUR USER DATA TO CONTAIN

const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type :String,
        required: true,
        unique: true
    },
});

//PASSPORT, ADDS ON USERNAME AND PASSWORD TO USER SCHEMA
UserSchema.plugin(passportLocalMongoose);



module.exports = mongoose.model('User', UserSchema);
