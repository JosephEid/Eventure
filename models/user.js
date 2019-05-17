var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

//Define user schema
var User = new Schema(
    {
        first_name: {type: String, required: true, max: 100},
        last_name: {type: String, required: true, max: 100},
        username: {type: String, required: true, max: 100},
        email: {type: String, required: true},
        password: {type: String, required: true} //Validity check here?
    }
);

//authenticate input against database
User.statics.authenticate = function (username, password, callback) {
    console.log(username + " " + password);
        userModel.findOne({ username: username })
            .exec(function (err, user) {
                if (err) {
                    console.log("here mate1");
                    return callback(err)
                } else if (!user) {
                    console.log("here mate2");
                    var err = new Error('User not found.');
                    err.status = 401;
                    return callback(err);
                }
                bcrypt.compare(password, user.password, function (err, result) {
                    console.log("here mate3");
                    if (result === true) {
                            return callback(null, user);
                    } else {
                            return callback();
                    }
                })
            });
};

User.pre('save', function (next) {
        var user = this;
        bcrypt.hash(user.password, 10, function (err, hash){
                if (err) {
                        return next(err);
                }
                user.password = hash;
                next();
        })
});

User.set('toObject', {getters: true, virtuals: true});

var userModel = mongoose.model('User', User);

module.exports = userModel;