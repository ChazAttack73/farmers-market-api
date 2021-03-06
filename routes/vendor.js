var express = require('express');
var app = express();
var router = express.Router();
var db = require('./../models');
var session = require('express-session');
var CONFIG = require('./../config/config.json');
var cookieParser = require('cookie-parser');
var Vendor = db.Vendor;
var Product = db.Product;
var bodyParser = require('body-parser');
//var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

router.use(bodyParser.json({ extended: false }));
router.use(cookieParser());

passport.serializeUser(function(vendor, done) {
 done(null, vendor);
});
passport.deserializeUser(function(vendor, done) {
 done(null, vendor);
});


function hash(req) {
  return new Promise (function(resolve, reject) {
  bcrypt.genSalt(12, function(err, salt) {
    if(err) {
      reject(err);
    }
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      resolve (hash);
    });
  });
  });
}

//Need to modify this to res. back an error (custom message or a
//send server error code.  Can call this middleware function on
//each route as done on register below.  On each Angular controller
//function, must have a listener for errors)
function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

//Being called from VendorService regVendor function
router.post('/register', function(req, res, next){
  console.log(4444444444444444, req.body);
  hash(req)
  .then(function(hash) {
    var userObj = {
    name : req.body.name,
    password: hash,
    phone : req.body.phone,
    email: req.body.email,
    website : req.body.website,
    description : req.body.description,
    company_pic : req.body.company_pic,
    EventId : req.body.EventId
    };
    Vendor.create(userObj)
    .then(function(user){
      console.log(5555555555, user);
      req.login(user, function(err) {
        if(err) {
          return next(err);
        }
        return res.json(user);
      });
    });
  });
}, logErrors);

//Login for Vendor being called from VendorService loginVen function
router.post('/login', passport.authenticate('local'), function(req, res) {
  res.json(req.user.dataValues);
});



//Being called from VendorService by getVendors function idenitfied by event id
router.get( '/event/:id', function( req, res){
  Vendor.findAll({
    where:{
      EventId: req.params.id
    }
  })
  .then (function (events){
    res.json( events );
  });
});

//Being called from VendorService by getOneVendorAndProducts function indentified by Vendor id
//gets one vendor and all products belonging to them
router.get( '/:id', function( req, res) {
  Vendor.findOne({
    where:{
      id: req.params.id
    },
    include : [
    {
      model: Product
    }]
  })
  .then (function (vendorInfo){
    res.json( vendorInfo );
  });
});


router.get( '/:productName/:id', function( req, res) {
  Vendor.findAll({
    where:{
      EventId: req.params.id
    },
    include : [
    {
      model: Product,
      where: {
        name: req.params.productName
      }
    }]
  })
  .then (function (vendorInfo){
    res.send( vendorInfo );
  });
});

//Being called from VendorService by logoutVen function
router.post('/logout', function(req, res) {
  req.logout();
  res.json({
    success : true
  });
});

router.post('/:id',function(req,res){
  Product.create(req.body)
  .then(function(product){
    res.json(product);
  });
});

//Being called from VendorService by editVendorInfo function
router.put('/:id', function( req, res){
  req.body.updatedAt = "now()";
  Vendor.findById(req.params.id)
  .then(function(data) {
    data.update(req.body)
    .then(function (vendor){
      res.json( vendor );
    });
  });
});


//Being called from VendorService by delVendor function
router.delete('/:id', function( req, res){
  Vendor.destroy({
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