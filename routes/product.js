//This route was stubbed out for me but I added all database queries
var express = require('express');
var app = express();
var router = express.Router();
var db = require('./../models');
var Product = db.Product;
var CONFIG = require('./../config/config.json');
var bodyParser = require('body-parser');
var Vendor = db.Vendor;
var Product = db.Product;

router.use(bodyParser.json());

//Being called from VendorServer by getProductsFromVendorsByEvent function
router.get('/:id', function(req, res) {
  Product.findAll({
      include: [{
          model: Vendor,
          where: { EventId: req.params.id }
      }]
  })
  .then(function(product){
    var productsArray = [];
    for(i = 0; i < product.length; i++){
      var productObj = {
        id : product[i].dataValues.id,
        name : product[i].dataValues.name,
        price : product[i].dataValues.price,
        quantity : product[i].dataValues.quantity,
        description : product[i].dataValues.description,
        product_picture : product[i].dataValues.product_picture,
      };
     productsArray.push(productObj);
    }
    res.send (productsArray);
  });
});

router.get('/product/:id', function(req, res) {
  Product.findOne({
      where: {
        id: req.params.id
      },
      include : [
        {
        model: Vendor
        }]
  })
  .then(function(product){
    res.send (product);
  });
});

//Being called from Product Service by getProducts function
router.get( '/', function ( req, res ) {
  Product.findAll()
    .then( function ( products ) {
      res.json( products );
    });
  });

router.post('/new', function(req, res){
  var productObj = {
    name : req.body.name,
    price : req.body.price,
    quantity : req.body.quantity,
    description : req.body.description,
    product_picture : req.body.product_picture,
    VendorId : req.body.VendorId
  };
  Product.create(productObj)
  .then (function (product){
    res.json( {
      success : true
    } );
  })
  .catch(function(error) {
    res.json(error);
  });
});

router.post( '/:id', function ( req, res ) {
  req.body.VendorId = req.params.id;
  Product.create(req.body)
    .then( function ( products ) {
      res.json( products );
    });
  });

router.put('/edit/:id', function( req, res){
  req.body.updatedAt = "now()";
  Product.findById(req.params.id)
  .then(function(data) {
    data.update(req.body)
    .then(function (product){
      res.json( product );
    });
  });
});


router.delete('/delete/:id', function( req, res){
  Product.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(function(data) {
    res.json(data);
  })
  .catch(function(err){
      console.log(err);
    });
});


module.exports = router;