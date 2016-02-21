var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var CONFIG = require('./config/config.json');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

var db = require('./models');

var Event = db.Event;
var Vendor = db.Vendor;
var Product = db.Product;
//make sure to type 'sequelize init' in the iTerm

app.use(session(CONFIG.SESSION));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser( function ( user, done ) {
  return done( null, user );
});

passport.deserializeUser( function ( user, done ) {
  return done( null, user );
});

app.use('/event', require('./routes/event.js'));
app.use('/product', require('./routes/product.js'));
app.use('/vendor', require('./routes/vendor.js'));
app.use('/register', require('./routes/user.js'));

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