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
var Vendor = db.Vendor;
var StripeVendor = db.StripeVendor;
var stripe = require("stripe")("sk_test_L3fF5CjV33nFCv2dg7vcKQmz");

var vendorForCallBack = null;

router.use(bodyParser.json({ extended: false }));

router.post('/:id',function( req, res){
  var productName = null;
  var vendorName = null;
  Order.create({
    productQuantity : req.body.productQuantity,
    totalCost : req.body.amount,
    UserId : req.body.user.id,
    ProductId : req.body.product //change to req.params.id

    // find the vendor id to the product
  })
  //add another then to retrieve the Vendor and info
  .then(function(order){
      Payment.create({
      token : req.body.token,
      OrderId : order.id
    })
  .then(function(data){
    Product.findOne({
      where:{
        id : req.body.product
      }
    })
  .then(function(data){
    productName = data.name;
    Vendor.findOne({
      where: {
        id : data.VendorId
      }
    })
  .then(function(data){
    vendorName = data.name;
    StripeVendor.findOne({
      where: {
        VendorId : data.id
      }
    })
  .then(function(data){
    var charge = stripe.charges.create({
      amount: req.body.amount, // amount in cents, again
      currency: "usd",
      source: req.body.token,
      destination : data.stripe_user_id,  //stripeVendor_user_id     //ac_sdipufghpdsfighfdgpdsfig this is an example of what i'm looking for, the stripe_user_id, from the response body
      description : "Example charge",
      //
      //application_fee : req.body.amount * 0.10,//that is the % of the charge that we want to take
      metadata:{
        vendor_name : vendorName,
        productId: req.body.product,
        product_name : productName,
        productQuantity: req.body.productQuantity,
        quantity_purchased : req.body.productQuantity
        //other thing if wanted like tax, subtotal, and etc
      }

    }, function(err, charge) {
      if (err) {

        switch (err.type) {
          case 'StripeCardError':
            // A declined card error
            err.message = "aloha"; // => e.g. "Your card's expiration year is invalid."
            break;
          case 'RateLimitError':
            // Too many requests made to the API too quickly
            err.message = "Too many requests made to the API too quickly";
            break;
          case 'StripeInvalidRequestError':
            // Invalid parameters were supplied to Stripe's API
            err.message = "Invalid characters in fields, please try again";
            break;
          case 'StripeAPIError':
            // An error occurred internally with Stripe's API
            err.message = "Stripe Error";
            break;
          case 'StripeConnectionError':
            // Some kind of error occurred during the HTTPS communication
            err.message = "Connection Error";
            break;
          case 'StripeAuthenticationError':
            // You probably used an incorrect API key
            err.message = "Incorrect API Key";
            break;
          default:
            // Handle any other types of unexpected errors
            err.message = "Error, please try again";
            break;
        }
        return res.json(err);
      }

      Product.findById(req.body.product).then(function(product) {
        return product.decrement('quantity', {by: req.body.productQuantity});
      });

    });
    res.json(charge);
  });
  });
  });
  });
  });
});

router.get('/callback', function(req, res){
  console.log("req.query");

  request.post({
    url: 'https://connect.stripe.com/oauth/token',
    form: {
      grant_type: "authorization_code",
      client_id: CONFIG.development.stripe.client_id,
      code: req.query.code,
      client_secret: CONFIG.development.stripe.secret_key
    }
  }, function(err, response, body) {

    var accessToken = JSON.parse(body).access_token;

    body = JSON.parse(body);
    // Do something with your accessToken
    // For demo"s sake, output in response:

    StripeVendor.create({
      access_token : accessToken,
      token_type : body.token_type,
      stripe_user_id : body.stripe_user_id,
      scope : body.scope,
      VendorId : req.user.id
    })
    // .then(function(data){
    //   //req.body.updatedAt = "now()";
    //   Vendor.update(
    //     {
    //       stripeId : data.stripe_user_id,
    //       updatedAt : "now()"
    //     }, {
    //     where : {
    //       id : data.VendorId
    //     }
    //   });
    // })
    .then(function(data){
      return res.redirect('/#/vendor/private');
    });
    //return; //res.send({ "Your Token": body });
  });
  // return;
});

module.exports = router;


