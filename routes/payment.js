var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('./../models');
var Order = db.Order;

var Payment = db.Payment;

router.use(bodyParser.json({ extended: false }));

router.post('/:id',function( req, res){
  console.log(44444444);
  console.log(req.body);

  // this is where i will be
  // Order.create({
  // });

  //and then this is where i will be recording payment
  //Payment.create({
  //});

  //after both have been recorded, return the json
  // .then(function(receipt){
    //return them to the product page
  // })


});


module.exports = router;