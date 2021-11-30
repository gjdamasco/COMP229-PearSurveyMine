let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

//Modules for authentification (Heylisse)
let session = require('express-session');
let passport = require('passport');

let passportJWT = require('passport-jwt');
let JWTStrategy = passportJWT.Strategy;
let ExtractJWT = passportJWT.ExtractJwt;

let passportLocal = require('passport-local');
let localStrategy = passportLocal.Strategy;

let flash = require('connect-flash');

// import "mongoose" - required for DB Access
let mongoose = require('mongoose');
// URI
let DB = require('./db')
mongoose.connect(process.env.URI || DB.URI, {useNewUrlParser: true, useUnifiedTopology: true});

let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection Error:'));
mongoDB.once('open', ()=> {
  console.log("Connected to MongoDB...");
});

let indexRouter = require('../routes/index');
let usersRouter = require('../routes/users');
let surveysRouter = require('../routes/surveys'); // routes for surveys
//let answersRouter = require('../routes/1answers'); // routes for surveys

let app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

//setup express session (Heylisse)
app.use(session({
  secret:"SomeSecrete",
  saveUninitialized: false,
  resave: false
}));

//Initialize flash (Heylisse)
app.use(flash());

// Initialize passport
app.use(passport.initialize());
app.use(passport.session()); 

// create a User Model Instance (Heylisse)
let userModel = require('../models/user');   //Camila: models
let User= userModel.User;

// implement a User Authentication strategy (H)
passport.use(User.createStrategy());

// serialize and seserialize the user info (Heylisse)
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/surveys', surveysRouter);
//app.use('/answers', answersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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