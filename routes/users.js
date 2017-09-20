const User = require('../models/user').User;

exports.get = function (req, res) {
    res.send(User.findOne({username: admin}, callback));
};