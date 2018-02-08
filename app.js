var express = require('express');
var session = require('express-session');
var SessionFileStore = require('session-file-store')(session);
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Express session global settings
app.use(session({
  secret: "you-will-never-remember-it", 
  saveUninitialized: false,
  resave: false,
  cookie: { maxAge: 60 * 1000 }
}));

// Routes for custom pages
var signin = require('./routes/signin');
var signout = require('./routes/signout');
var dashboard = require('./routes/dashboard');


// Gateway of web application
app.all('*', function (req, res, next) {
  if(req.session.userProfile || req.url === '/signin') {
    req.session.previousUrl = null;
    next();
  } else {
    req.session.previousUrl = req.url;
    res.redirect('/signin');
  }
});

// List of routes
app.use('/signin', signin);
app.use('/signout', signout);
app.use('/dashboard', dashboard);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
