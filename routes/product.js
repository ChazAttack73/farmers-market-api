var express = require('express');
var app = express();
var router = express.Router();
var db = require('./../models');
var Product = db.Product;
var bodyParser = require('body-parser');

router.use(bodyParser.json());


//This should probably go in product router
router.post( '/:id', function ( req, res ) {
  req.body.VendorId = req.params.id;
  Product.create(req.body)
    .then( function ( products ) {
      res.json( products );
    });
  });

//Being called from VendorServer by getProductsFromVendorsByEvent function
router.get('/products/:id', function(req, res) {
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

router.put('/charge/:id', function(req, res){
  console.log(33333333);
  req.body.updatedAt = "now()";
  console.log(req.body);
  Product.update(
    {
      quantity: req.body.quantity
    }, {
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