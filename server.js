var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var db = require( './models' );

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

var Company = db.Company;
var Product = db.Product;



app.listen(3000,function(){
  console.log('CONNECTED');
  db.sequelize.sync();
});