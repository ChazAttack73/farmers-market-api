var express = require('express');
var app = express();
var router = express.Router();
var http = require('http');
var request = require('request');
var bodyParser = require('body-parser');
var db = require('./../models');
var CONFIG = require("./../config/config");
var Order = db.Order;
var Payment = db.Payment;
var Product = db.Product;
var StripeVendor = db.StripeVendor;
var stripe = require("stripe")("sk_test_L3fF5CjV33nFCv2dg7vcKQmz");

var vendorForCallBack = null;

router.use(bodyParser.json({ extended: false }));

router.post('/:id',function( req, res){
  console.log(11111111111111,req.body);
  Order.create({
    productQuantity : req.body.productQuantity,
    totalCost : req.body.amount,
    UserId : req.body.user.id,
    ProductId : req.body.product
  }).
  then(function(order){
    console.log(2222222222222, order);
       Payment.create({
      token : req.body.token,
      OrderId : order.id
    })
    .then(function(data){
      console.log(333333333333333333, data);
      var charge = stripe.charges.create({
        amount: req.body.amount, // amount in cents, again
        currency: "usd",
        source: req.body.token,
        //destination: stripeVendor_user_id     //ac_sdipufghpdsfighfdgpdsfig this is an example of what i'm looking for, the stripe_user_id, from the response body
        description: "Example charge",
        //
        //application_fee : that is the % of the charge that we want to take
        metadata:{
          productId: req.body.product,
          productQuantity: req.body.productQuantity,
          //other thing if wanted like tax, subtotal, and etc
        }

      }, function(err, charge) {
        console.log(444444444444444, charge);
        if (err && err.type === 'StripeCardError') {
          // The card has been declined
          return res.json('error');
        }

        Product.findById(req.body.product).then(function(product) {
          console.log(55555555555)
          return product.decrement('quantity', {by: req.body.productQuantity});
        });

      });
      res.json(charge);
    });

  });
});

router.get('/callback', function(req, res){
  console.log("req.query");
  // res.redirect('/vendor/private');
  request.post({
    url: 'https://connect.stripe.com/oauth/token',
    form: {
      grant_type: "authorization_code",
      client_id: CONFIG.development.stripe.client_id,
      code: req.query.code,
      client_secret: CONFIG.development.stripe.secret_key
    }
  }, function(err, response, body) {
    console.log('err', err);
    console.log('response', response);
    console.log('body', body);

    var accessToken = JSON.parse(body).access_token;

    body = JSON.parse(body);
    // Do something with your accessToken

    // For demo"s sake, output in response:

    console.log(111111, body);
    console.log(222222, accessToken);


//80457604856754039678349586754093687345897345096873405968734059687
    //=====46-028475-47829-876-9428762-9ew68795449-w68724-98
    //this is where i save body to the StripeVendor table
    StripeVendor.create({
      access_token : accessToken,
      token_type : body.token_type,
      stripe_user_id : body.stripe_user_id,
      scope : body.scope
      //VendorId :
    })
    //and then redirect them to the vendor/private
    .then(function(data){
      console.log(data);
      return res.redirect('/#/vendor/private');
    });
    // return res.send({ "Your Token": body });
  });
  // return;
});

module.exports = router;


