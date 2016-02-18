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
      name: req.body.name,
      password: req.body.password,
      phone: req.body.phone,
      email : req.body.email,
      website: req.body.website,
      description: req.body.description,
      company_pic: req.body.company_pic
    })
    .then( function ( vendors ) {
      res.json( vendors );
    });
  });

module.exports = router;