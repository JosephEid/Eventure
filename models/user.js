var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var User = new Schema(
    {
        first_name: {type: String, required: true, max: 100},
        last_name: {type: String, required: true, max: 100},
        email: {type: String},
        password: {type: String} //Validity check here?
    }
);

User.set('toObject', {getters: true, virtuals: true});

var userModel = mongoose.model('User', User);

module.exports = userModel;