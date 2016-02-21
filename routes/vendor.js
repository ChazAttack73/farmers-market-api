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
      console.log(hash);
      resolve (hash);
    });
  });
  });
}

router.post('/register', function(req, res){
  hash(req)
  .then(function(hash) {
    var userObj = {
    name : req.body.username,
    password: hash,
    phone : req.body.phone,
    email: req.body.email,
    website : req.body.website,
    description : req.body.description,
    company_pic : req.body.company_pic
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
  res.json(req.body);
});

passport.use(new LocalStrategy({
  passReqToCallback: true
  },
  function(req, name, password, done) {
    var vendorUserName = name;
    Vendor.findOne({
      name: vendorUserName
    })
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
  req.body.updatedAt = "now()";
  Vendor.update(
    req.body, {
    where : {
      id : req.params.id
    }
  })
  .then(function(vendorUpdateCount){
    return Vendor.findOne({
      where:{
        id:req.params.id
      }
    });
  })
  .then(function(vendor){
    res.json( vendor );
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

/////////////////////////////////////////////////////////////////////////



module.exports = router;