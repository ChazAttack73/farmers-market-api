var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var CONFIG = require('./config/config.json');
var bcrypt = require('bcrypt');


app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

var db = require('./models');

var Event = db.Event;
var Vendor = db.Vendor;
var User = db.User;
var Product = db.Product;

app.use(session(CONFIG.SESSION));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser( function ( user, done ) {
  return done( null, user );
});

passport.deserializeUser( function ( user, done ) {
  return done( null, user );
});
//authenticate middleware ('local') called in above function upon login
passport.use(new LocalStrategy({
  passReqToCallback: true
  },
  function(req, name, password, done) {

    if(req.body.type==='vendor'){
      var vendorUserName = name;
      Vendor.findOne({
        where: {
          name : vendorUserName
        }
      })
      .then(function(vendor){
        bcrypt.compare(password, vendor.password, function(err, res){
          if(err) {
            return done(err);
          }
          return done(null, vendor);
        });
      }).catch(done);


    } else {
      User.findOne({
        where: {
          email : name
        }
      })
    .then(function(user){

      bcrypt.compare(password, user.password, function(err, res){
        if(err) {
          return done(err);
        }
        return done(null, user);
      });
    }).catch(done);
    }



}));

app.use('/event', require('./routes/event.js'));
app.use('/product', require('./routes/product.js'));
app.use('/vendor', require('./routes/vendor.js'));
app.use('/user', require('./routes/user.js'));
app.use('/stripe', require('./routes/stripe.js'));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

app.get('/api/authenticate', function(req, res){
  res.send(req.isAuthenticated() ? req.user : '0');
});


app.get('/', function ( req, res){
  Event.findAll()
    .then( function ( events ){
      res.json ( events );
    });
});


app.listen(3000,function(){
 db.sequelize.sync();
  console.log('CONNECTED ON PORT 3000');
});