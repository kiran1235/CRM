
var express = require('express');
var path = require('path');

var models = require('../models/index.js');
/** routers & controllers **/
var application=require('../controllers/application.js');
var applicationrouter = express.Router();
applicationrouter.get('/',function(req,res,next){
    res.render('index',{title:application.name});
}).get('/client',function(req,res,next){
    res.render('client',{title:application.name});
});


module.exports = applicationrouter;