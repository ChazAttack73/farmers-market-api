var express = require('express');
var app = express();
var router = express.Router();
var db = require('./../models');
var Vendor = db.Vendor;
var Product = db.Product;
var bodyParser = require('body-parser');

router.use(bodyParser.json());

router.get( '/', function ( req, res ) {
  Vendor.findAll()
    .then( function ( vendors ) {
      res.json( vendors );
    });
  });

router.post( '/', function ( req, res ) {
  Vendor.create(req.body)
    .then( function ( vendors ) {
      res.json( vendors );
    });
  });

router.get( '/:id', function( req, res){
  Vendor.findOne({
    where:{
      id: req.params.id
    }
  })
  .then (function (vendor){
    res.json( vendor );
  });
});

router.put('/:id', function( req, res){
  req.body.updatedAt = "now()";
  Vendor.update(
    req.body, {
    where : {
      id : req.params.id
    }
  })
  .then(function(vendorUpdateCount){
    return Vendor.findOne({
      where:{
        id:req.params.id
      }
    });
  })
  .then(function(vendor){
    res.json( vendor );
  });
});

router.delete('/:id', function( req, res){
  Vendor.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(function(){
    Vendor.findAll()
    .then( function ( vendors ) {
      res.json( vendors );
    });
  });
});

router.get('/:id/products/', function( req , res){
  Product.findAll({
    where:{
      VendorId: req.params.id
    }
  })
  .then( function ( products){
    res.json ( products );
  });
});

router.post('/:id/products/', function( req, res){
  req.body.VendorId = req.params.id;
  Product.create(req.body)
  .then( function ( product ){
    res.json( product );
  });
});

router.get( '/:id/products/:product', function( req, res){
  Product.findOne({
    where:{
      id: req.params.product
    }
  })
  .then (function (product){
    res.json( product );
  });
});


router.put('/:id/products/:product', function( req, res){
  req.body.updatedAt = "now()";
  Product.update(
    req.body, {
    where : {
      id : req.params.product
    }
  })
  .then(function(productUpdateCount){
    return Product.findOne({
      where:{
        id:req.params.product
      }
    });
  })
  .then(function(product){
    res.json( product );
  });
});

router.delete('/:id/products/:product', function( req, res){
  Product.destroy({
    where: {
      id: req.params.product
    }
  })
  .then(function(){
    Product.findAll()
    .then( function ( product ) {
      res.json( product );
    });
  });
});


module.exports = router;