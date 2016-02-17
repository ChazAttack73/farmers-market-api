var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var CONFIG = require('.config/config.js');

// var db = require('.models');

app.use(session(CONFIG.SESSION));
app.use('/vendor', require('./routes/vendor.js'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

app.get('*', function(req,res) {
  res.sendFile('/public/index.html', { root : __dirname });
});



app.listen(3000,function(){
  //db.sequelize.sync();
  console.log('CONNECTED');
});