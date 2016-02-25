var express = require('express');
var app = express();
var router = express.Router();
var db = require('./../models');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var User = db.User;
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var stripe = require("stripe")(
  "sk_test_L3fF5CjV33nFCv2dg7vcKQmz"
);

router.use(bodyParser.json({ extended: false }));

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
//////////////////////////////////////////

stripe.customers.create({
  description: 'Customer for test@example.com',
  source: "tok_17hqcIDK8coYE9nRCsq68CBk" // obtained with Stripe.js
}, function(err, customer) {
  // asynchronously called
});
//////////////////////////////////////////
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