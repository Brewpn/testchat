const express = require('express');
const app = express();
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const mongoose = require('./libs/mongoose');
const HttpError = require('./error/index').HttpError;
const socketIo = require('socket.io');
var io = socketIo();
app.io = io;

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// view engine setup
app.engine('ejs', require('ejs-mate'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('./middleware/sendHttpError'));

//const users = require('./routes/users');
require('./routes/index')(app);

// express-session
app.use(session({
    secret: "topSecret",
    key: "sid",
    cookie: {
      path: "/",
      httpOnly: true,
      maxAge: null
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        adapter: 'connect-mongo'
    }),
    resave: true,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// socket.io server code test
io.sockets.on('connection', function (socket) {

    socket.on('message', function (text, cb) {
        socket.broadcast.emit('message', text);
        cb("123");
    });

});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

app.use(function(err, req, res, next) {
    if (typeof err === 'number') {
        err = new HttpError(err);
    }

    if (err instanceof HttpError) {
        res.sendHttpError(err);
    } else {
        if (app.get('env') === 'development') {
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            // render the error page
            res.status(err.status || 500);
            res.render('error');
        } else {
            log.error(err);
            err = new HttpError(500);
            res.sendHttpError(err);
        }
    }
});

module.exports = app;
