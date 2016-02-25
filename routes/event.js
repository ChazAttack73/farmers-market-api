var express = require('express');
var app = express();
var router = express.Router();
var db = require('./../models');
var Event = db.Event;
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

router.get('/', function ( req, res){
  Event.findAll()
    .then( function ( events ){
      res.json ( events );
    });
});

router.post( '/', function ( req, res ) {
  Event.create(req.body)
    .then( function ( events ) {
      res.json( events );
    });
  });

router.get('/events/:id', function(req, res){
  Event.findAll({
    where : {
      id : req.params.id
    }
  })
  .then(function(event){
    res.json(event);
  });
});

// router.get( '/:id', function( req, res){
//   Vendor.findAll({
//     where:{
//       EventId: req.params.id
//     }
//   })
//   .then (function (events){
//     res.json( events );
//   });
// });

router.post( '/:id', function ( req, res ) {
  req.body.EventId = req.params.id;
  console.log(req.body);
  Vendor.create(req.body)
    .then( function ( vendors ) {
      res.json( vendors );
    });
  });

router.put('/:id', function( req, res){
  req.body.updatedAt = "now()";
  Event.update(
    req.body, {
    where : {
      id : req.params.id
    }
  })
  .then(function(EventUpdateCount){
    return Event.findOne({
      where:{
        id:req.params.id
      }
    });
  })
  .then(function(events){
    res.json( events );
  });
});

router.delete('/:id', function( req, res){
  Event.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(function(){
    Event.findAll()
    .then( function ( events ) {
      res.json( events );
    });
  });
});

// router.get('/:id/product', function( req, res){
//   Event.findOne({
//     where:{
//       id: req.params.id
//     },
//     include : [
//     {
//       model: Vendor,
//         include : [
//       {
//         model: Product
//       }]
//     }]
//   })
//   .then (function (vendorInfo){
//     res.json( vendorInfo );
//   });
// });

module.exports = router;