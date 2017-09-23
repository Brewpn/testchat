const crypto = require('crypto'),
    async = require('async'),
    util = require('util');

const mongoose =  require('../libs/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

schema.methods.encryptPassword = function (password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        this.salt = Math.random() + '';
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._plainPassword;
    });

schema.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
};


// 1) Find username
// 2) check User password
//      - if there is no user with that password, we will create this user
// END) after all operations user session are saved with express-session

schema.statics.authorize = function(username, password, callback) {
    var User = this;

    async.waterfall([
        function(callback){
            User.findOne({username: username}, callback);
        },
        function(user, callback) {
            if (user) {
                if (user.checkPassword(password)) {
                    callback(null, user);
                } else {
                    next(new AuthError(403, 'Wrong password'));
                }
            } else {
                user = new User({username: username, password: password});
                user.save(function (err) {
                    callback(null, user);
                });
            }
        }
    ], callback)

    // user authorize with using promises(not working)
    // var promise = new Promise;
    //
    //     promise
    //         .then(function (callback) {
    //         User.findOne({username: username}, callback)
    //     })
    //     .then(function (callback) {
    //         if (user) {
    //             if (user.checkPassword(password)){
    //                 callback(null, user);
    //             } else {
    //                 next(new AuthError(403, 'Wrong password'));
    //             }
    //         } else {
    //             user = new User({username: username, password: password});
    //             user.save(function (err) {
    //                 callback(null, user);
    //             });
    //         }
    //     })
    //     .catch(function (err) {
    //         if (err) {
    //             if (err instanceof AuthError) {
    //                 return next(new HttpError(403, err.message));
    //             } else {
    //                 return next(err);
    //             }
    //         }
    //     });

};

exports.User = mongoose.model('User', schema);

function AuthError(message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, AuthError);

    this.message = message;
}

util.inherits(AuthError, Error);

AuthError.prototype.name = 'AuthError';

exports.AuthError = AuthError;