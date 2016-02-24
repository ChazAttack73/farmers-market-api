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

router.post('/register', function(req, res){
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
      req.login(user, function(err) {
        if(err) {
          return next(err);
        }
        return res.json(user);
      });
    });
  });
});

//Login for Vendor
router.post('/login', passport.authenticate('local'), function(req, res) {
  res.json(req.user.dataValues);
});

passport.use(new LocalStrategy({
  passReqToCallback: true
  },
  function(req, name, password, done) {
    var vendorUserName = name;
    Vendor.findOne({
      where: {
        name : vendorUserName
      }
    }
    )
    .then(function(vendor){
      bcrypt.compare(password, vendor.password, function(err, res){
        if(err) {
          return done(err);
        }
        return done(null, vendor);
      });
    }).catch(done);
}));

router.get( '/', function ( req, res ) {
  Vendor.findAll({})
    .then( function ( vendors ) {
      res.json( vendors );
    })
  ;
});

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

router.post('/logout', function(req, res) {
  req.logout();
  res.json({
    success : true
  });
});

router.post( '/:id', function ( req, res ) {
  req.body.VendorId = req.params.id;
  Product.create(req.body)
    .then( function ( products ) {
      res.json( products );
    });
  });

router.put('/:id', function( req, res){
  console.log('here at server edit for vendor?', req.params);
  req.body.updatedAt = "now()";
  Vendor.findById(req.params.id)
  .then(function(data) {
    data.update(req.body)
    .then(function (vendor){
      res.json( vendor );
    });
  });
});

router.delete('/:id', function( req, res){
  Vendor.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(function(){
    Vendor.findAll()
    .then( function ( vendors ) {
      res.json( vendors );
    });
  });
});


module.exports = router;