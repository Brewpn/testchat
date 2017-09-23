const mongoose = require("./libs/mongoose"),
    User = require("./models/user").User,
    async = require('async');

mongoose.connection.on('open', function () {
    var db = mongoose.connection.db;
    db.dropDatabase(function (err) {
        if (err) throw err;

        async.parallel([
            function (callback) {
                var someUser = new User({username: 'someUser', password: 'somePassword'});
                someUser.save(function (err) {
                    callback(err, someUser);
                })
            }
        ], function (err, result) {
            console.log(arguments);
            mongoose.disconnect();
        })
    })
});