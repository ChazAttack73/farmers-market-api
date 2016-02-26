var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('./../models');
var Order = db.Order;
var Payment = db.Payment;
var stripe = require("stripe")("pk_test_zjMkVWS57QxqiP9XPIdiy7uF");

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
        amount: 1000, // amount in cents, again
        currency: "usd",
        source: req.body.token,
        description: "Example charge"
      }, function(err, charge) {
        if (err && err.type === 'StripeCardError') {
          // The card has been declined
        }
      });
      res.json(charge);
    });

  });

});


module.exports = router;


