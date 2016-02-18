var express = require('express');
var app = express();
var router = express.Router();
var db = require('./../models');
var Vendor = db.Vendor;
var bodyParser = require('body-parser');

router.use(bodyParser.json());

router.get( '/', function ( req, res ) {
Vendor.findAll()
  .then( function ( vendors ) {
    res.json( vendors );
  });
});

router.post( '/', function ( req, res ) {
  Vendor.create(
    {
      title: req.body.title,
      priority: req.body.priority,
      created_by: req.user.username,
      assigned_to : req.body.assigned_to,
      status: 'toDo',
      UserId: req.user.id
    })
    .then( function ( vendors ) {
      res.json( vendors );
    });
  });

module.exports = router;