var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var CONFIG = require('./config/config.js');

var db = require('./models');
var Company = db.Company;
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


app.use('/vendor', require('./routes/vendor.js'));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));


app.listen(3000,function(){
  db.sequelize.sync();
  console.log('CONNECTED');
});