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
  User.create(
    {
      username : req.body.username,
      password : req.body.password
    })
    .then( function ( user ) {
      res.json( user );
    });
  });