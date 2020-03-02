var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
mongoose.set('useCreateIndex', true);

var UserSchema = new mongoose.Schema({
    name: String,
    password: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);