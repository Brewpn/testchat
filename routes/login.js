const User = require('../models/user').User,
    AuthError = require('../models/user').AuthError,
    HttpError = require('../error/index').HttpError,
    async = require('async');

exports.get = function (req, res) {
    res.render('login');
};

// Problem with sessions

exports.post = function (req, res, next) {
    var username = req.body.username,
        password = req.body.password;

    User.authorize(username, password, function (err, user) {
        if (err) {
            if (err instanceof AuthError) {
                return next(new HttpError(403, err.message));
            } else {
                return next(err);
            }
        }

        // req.session.user = user._id;
        res.send({});
    });

    // 1) Find username
    // 2) check User password
    //      - if there is no user with that password, we will create this user
    // END) after all operations user session are saved with express-session


};