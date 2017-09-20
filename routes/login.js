const User = require('../models/user').User,
    async = require('async'),
    createError = require('http-errors');

exports.get = function (req, res) {
    res.render('login');
};

// Can be problem with bodyParser
// Todo Do it without async. Use promises
exports.post = function (req, res, next) {
    var username = req.body.username,
        password = req.body.password;

    User.authorize(username, password, function (err, user) {
        if (err) return next(err);

        req.session.user = user._id;
        req.send({});
    });

    // 1) Find username
    // 2) check User password
    //      - if there is no user with that password, we will create this user
    // END) after all operation user session are saved with express-session

    async.waterfall([
        function(callback){
            User.findeOne({username: username}, callback);
        },
        function(user, callback) {
            if (user) {
                if (user.checkPassword(password)){
                    callback(null, user);
                } else {
                    next(createError(403, 'Wrong password'));
                }
            } else {
                user = new User({username: username, password: password});
                user.save(function (err) {
                    callback(null, user);
                });
            }
        }
    ], function (err, user) {
        if (err) return next(err);
        req.session.user = user._id;
        res.send({});
    })
};