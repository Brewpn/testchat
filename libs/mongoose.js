const mongoose = require('mongoose'),
    assert = require('assert');

mongoose.connect("mongodb://localhost/chat",{
    useMongoClient: true,
    keepAlive: 1,
    promiseLibrary: global.Promise
    });

module.exports = mongoose;