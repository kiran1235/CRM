
var express = require('express');
var path = require('path');


/** routers & controllers **/
var application=require('../controllers/application.js');
var applicationrouter = express.Router();
applicationrouter.get('/',function(req,res,next){
    res.render('index',{title:application.name});
});



module.exports = applicationrouter;