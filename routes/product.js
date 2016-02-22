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

router.get( '/:id', function( req, res){
  Product.findOne({
    where:{
      id: req.params.id
    }
  })
  .then (function (product){
    res.json( product );
  });
});

router.post('/new', function(req, res){
  var productObj = {
    name : req.body.name,
    price : req.body.price,
    quantity : req.body.quantity,
    description : req.body.description,
    product_picture : req.body.product_picture
  };
  Product.create(productObj);
});

router.put('/:id', function( req, res){
  req.body.updatedAt = "now()";
  Product.update(
    req.body, {
    where : {
      id : req.params.id
    }
  })
  .then(function(ProductUpdateCount){
    return Product.findOne({
      where:{
        id:req.params.id
      }
    });
  })
  .then(function(product){
    res.json( product );
  });


});

router.delete('/:id', function( req, res){
  Product.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(function(){
    Product.findAll()
    .then( function ( products ) {
      res.json( products );
    });
  });

});



module.exports = router;