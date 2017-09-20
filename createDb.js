var User = require("./models/user").User,
    mongoose = require('./libs/mongoose');

var user  = new User({
    username: "Kek"
});

user.save(function (err, user, affected) {
    console.log(arguments);
});