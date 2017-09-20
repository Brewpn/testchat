const mongoose = require('mongoose'),
    Promise = require('mpromise'),
    assert = require('assert');

mongoose.Promise = Promise;

mongoose.connect("mongodb://localhost/chat",{
    useMongoClient: true,
    server: {
        socketOptions: {
            keepAlive: 1
        }
    }});

module.exports = mongoose;