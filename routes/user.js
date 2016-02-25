var express = require('express');
var app = express();
var router = express.Router();
var db = require('./../models');
var session = require('express-session');
var CONFIG = require('./../config/config.json');
var cookieParser = require('cookie-parser');
var User = db.User;
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var stripe = require("stripe")(
  "sk_test_L3fF5CjV33nFCv2dg7vcKQmz"
);

router.use(bodyParser.json({ extended: false }));
router.use(cookieParser());

passport.serializeUser(function(user, done) {
 done(null, user);
});
passport.deserializeUser(function(user, done) {
 done(null, user);
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.json(req.user.dataValues);
});

//authenticate middleware ('local') called in above function upon login
passport.use(new LocalStrategy({
  passReqToCallback: true
  },
  function(req, name, password, done) {
    console.log(33333333333333);
    console.log(req.body);
    console.log(name);
    console.log(password);
    var UserName = name;
    console.log(UserName);
    User.findOne({
      where: {
        name : UserName
      }
    }
    )
    .then(function(user){
      console.log(4444444444444);
      console.log(user);
      bcrypt.compare(password, user.password, function(err, res){
        if(err) {
          console.log(4.5);
          return done(err);
        }
        console.log(5555555555);
        return done(null, user);
      });
    }).catch(done);
}));

function hash(req) {
  return new Promise (function(resolve, reject) {
  bcrypt.genSalt(12, function(err, salt) {
    if(err) {
      reject(err);
    }
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      resolve (hash);
    });
  });
  });
}


router.get( '/', function ( req, res ) {
  User.findAll()
    .then( function ( users ) {
      res.json( users );
    });
  });

router.post( '/', function ( req, res ) {
  console.log(3333333);
  console.log(req.body.email);
  User.findOne({
    where:{
      email: req.body.email
    }
  })
  .then (function (data){
    console.log(444444444);
    if(data===null){
      hash(req)
        .then(function(hash) {
          var userObj = {
          email : req.body.email,
          password: hash,
          };

          User.create(userObj)
          .then(function(user){
            req.login(user, function(err) {
              if(err) {
                return next(err);
              }
              return res.json(user);
            });
          });

        });
    } else {
      //EEEEERRRRRROOOOOOOORRRRRR
      console.log(4.5);
      return res.send("username already taken");
    }
  });





});


module.exports = router;