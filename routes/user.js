var express = require('express');
var app = express();
var router = express.Router();
var db = require('./../models');
var User = db.User;
var bodyParser = require('body-parser');

router.use(bodyParser.json());

router.get( '/', function ( req, res ) {
  User.findAll()
    .then( function ( users ) {
      res.json( users );
    });
  });

router.post( '/', function ( req, res ) {
  User.findOne({
    where:{
      username: req.body.username
    }
  })
  .then (function (data){
    if(data===null){
      User.create(req.body)
        .then( function ( user ) {
          return res.json( user );
        });
    } else {
      return res.send("username already taken");
    }
  });


});


module.exports = router;