var express = require('express');
var app = express();
var router = express.Router();
var db = require('./../models');
var Task = db.Task;
var bodyParser = require('body-parser');

router.use(bodyParser.json());



module.exports = router;