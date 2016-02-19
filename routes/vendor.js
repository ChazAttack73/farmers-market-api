var express = require('express');
var app = express();
var router = express.Router();
var db = require('./../models');
var Vendor = db.Vendor;
var Product = db.Product;
var bodyParser = require('body-parser');
//var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

router.use(bodyParser.json());

passport.serializeUser(function(vendor, done) {
 done(null, vendor);
});
passport.deserializeUser(function(vendor, done) {
 done(null, vendor);
});

//Login for Vendor
// app.post('/login/vendor', passport.authenticate('local'), function(req, res) {
//   res.send(req.vendor);
// });

// passport.use(new LocalStrategy({
//   passReqToCallback: true
//   },
//   function(req, username, password, done) {
//     var vendorUserName = req.body.username;
//     Vendor.findOne({
//       username: vendorUserName
//     })
//     .then(function(vendor){
//       if(!vendor){
//         return done(null, false);
//       }
//       bcrypt.compare(password, vendor.password, function(err, res){
//         if(vendor.username === username && res === false){
//           return done(null, false);
//         }
//         if(vendor.username === username && res === true){
//           return done(null, vendor);
//         }
//       });
//     });
// }));



router.get( '/', function ( req, res ) {
  Vendor.findAll()
    .then( function ( vendors ) {
      res.json( vendors );
    });
  });

router.post( '/', function ( req, res ) {
  Vendor.create(req.body)
    .then( function ( vendors ) {
      res.json( vendors );
    });
  });

router.get( '/:id', function( req, res){
  console.log("im on the server side!");
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