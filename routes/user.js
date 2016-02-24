var express = require('express');
var app = express();
var router = express.Router();
var db = require('./../models');
var User = db.User;
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');

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
  console.log(req.body.username);
  User.findOne({
    where:{
      username: req.body.username
    }
  })
  .then (function (data){
    console.log(444444444);
    if(data===null){
      hash(req)
        .then(function(hash) {
          var userObj = {
          username : req.body.username,
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
      return res.send("username already taken");
      console.log(4.5);
    }
  });


});


module.exports = router;