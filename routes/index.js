const express = require('express');

const User = require('../models/user').User,
    HttpError = require('../error/index').HttpError;

module.exports = function (app) {
    app.get('/', require('./frontpage').get);

    app.get('/login', require('./login').get);
    app.post('/login', require('./login').post);

    app.get('/chat', require('./chat').get);


    app.get('/users', function (req, res, next) {
        User.find({}, function (err, users) {
            if (err) return next(err );
            res.json(users);
        })
    });

    app.get('/user/:id', function (req, res, next) {
        User.findById(req.params.id, function (err, user) {
            if (err) return next(err);
            if (!user) {
                  next(new HttpError(404, 'User not found'))
            } else res.json(user);
        })
    })
};
