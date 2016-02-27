var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('./../models');
var Order = db.Order;
var Payment = db.Payment;
var Product = db.Product;
var stripe = require("stripe")("sk_test_L3fF5CjV33nFCv2dg7vcKQmz");

router.use(bodyParser.json({ extended: false }));

router.post('/:id',function( req, res){

  Order.create({
    productQuantity : req.body.productQuantity,
    totalCost : req.body.amount,
    UserId : req.body.user.id,
    ProductId : req.body.product
  }).
  then(function(order){
       Payment.create({
      token : req.body.token,
      OrderId : order.id
    })
    .then(function(data){
      var charge = stripe.charges.create({
        amount: req.body.amount, // amount in cents, again
        currency: "usd",
        source: req.body.token,
        description: "Example charge",
        metadata:{
          productId: req.body.product,
          productQuantity: req.body.productQuantity,
          //other thing if wanted like tax, subtotal, and etc
        }

      }, function(err, charge) {
        if (err && err.type === 'StripeCardError') {
          // The card has been declined
          return res.json('error');
        }

        Product.findById(req.body.product).then(function(product) {
          return product.decrement('quantity', {by: req.body.productQuantity});
        });

      });
      res.json(charge);
    });

  });
});

router.get('/callback', function(req, res){
  res.redirect('/vendor/private');
});

module.exports = router;


