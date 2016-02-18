var express = require('express');
var app = express();
var router = express.Router();
var db = require('./../models');
var Product = db.Product;
var bodyParser = require('body-parser');

router.use(bodyParser.json());

router.get( '/', function ( req, res ) {
  Product.findAll()
    .then( function ( products ) {
      res.json( products );
    });
  });

router.post( '/', function ( req, res ) {
  Product.create(
    {
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      description: req.body.description,
      product_picture : req.body.product_picture,
      // VendorId: req.vendor.id
    })
    .then( function ( products ) {
      res.json( products );
    });
  });

module.exports = router;