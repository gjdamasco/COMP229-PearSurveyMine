var express = require('express');
//const surveys = require('../models/surveys');
var router = express.Router();

let mongoose = require('mongoose');
let passport = require('passport');

// enable jwt
let jwt = require('jsonwebtoken');
let DB = require('../config/db');

// create the User Model instance
let userModel = require('../models/user');
let User = userModel.User; // alias


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Pear Survey Builder' , displayName: req.user ? req.user.displayName : ''});
});
/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('home', { title: 'Pear Survey Builder' , displayName: req.user ? req.user.displayName : ''});
});

/* GET active surveys. */

router.get('/active', function(req, res, next) {
    res.render('active', { title: 'Active Survey' , displayName: req.user ? req.user.displayName : ''});
});




//Camila: Pass code from modules to routes folder⏬⏬

/* GET Route for displaying the login page. (Heylisse)*/
router.get('/login', function(req, res, next) {
  // check if the user is already logged in
  if(!req.user)
  {
      res.render('auth/login', 
      {
         title: "Login",
         messages: req.flash('loginMessage'),
         displayName: req.user ? req.user.displayName : '' 
      })
  }
  else
  {
      return res.redirect('/');
  }
}
);

/* GET Route for processing the login page. (Heylisse)*/
router.post('/login', function(req, res, next) {
  passport.authenticate('local',
  (err, user, info) => {
      // server err?
      if(err)
      {
          return next(err);
      }
      // is there a user login error?
      if(!user)
      {
          req.flash('loginMessage', 'Authentication Error');
          return res.redirect('/login');
      }
      req.login(user, (err) => {
          // server error?
          if(err)
          {
              return next(err);
          }

          const payload = 
          {
              id: user._id,
              displayName: user.displayName,
              username: user.username,
              email: user.email
          }

          const authToken = jwt.sign(payload, DB.Secret, {
              expiresIn: 604800 // 1 week
          });

          /* TODO - Getting Ready to convert to API
          res.json({success: true, msg: 'User Logged in Successfully!', user: {
              id: user._id,
              displayName: user.displayName,
              username: user.username,
              email: user.email
          }, token: authToken});
          */

          return res.redirect('/surveys');
      });
  })(req, res, next);
});

/* GET Route for displaying the register page. (Heylisse)*/
router.get('/register', function(req, res, next) {
  // check if the user is not already logged in
  if(!req.user)
  {
      res.render('auth/register',
      {
          title: 'Register',
          messages: req.flash('registerMessage'),
          displayName: req.user ? req.user.displayName : ''
      });
  }
  else
  {
      return res.redirect('/');
  }
});

/* GET Route for processing the register page. (Heylisse)*/
router.post('/register', function(req, res, next) {
  // instantiate a user object
  let newUser = new User({
      username: req.body.username,
      //password: req.body.password
      email: req.body.email,
      displayName: req.body.displayName
  });

  User.register(newUser, req.body.password, (err) => {
      if(err)
      {
          console.log("Error: Inserting New User");
          if(err.name == "UserExistsError")
          {
              req.flash(
                  'registerMessage',
                  'Registration Error: User Already Exists!'
              );
              console.log('Error: User Already Exists!')
          }
          return res.render('auth/register',
          {
              title: 'Register',
              messages: req.flash('registerMessage'),
              displayName: req.user ? req.user.displayName : ''
          });
      }
      else
      {
          // if no error exists, then registration is successful
          // redirect the user and authenticate them
          /* TODO - Getting Ready to convert to API
          res.json({success: true, msg: 'User Registered Successfully!'});
          */
          return passport.authenticate('local')(req, res, () => {
              res.redirect('/surveys')
          });
      }
  });
});

/* GET Route to perform User Logout. (Heylisse)*/
router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
