var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('./../models');
var Order = db.Order;
var Payment = db.Payment;

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
      res.json(data);
    });

  });

});


module.exports = router;