
var express = require('express');
var path = require('path');

var models = require('../models/index.js');

/** routers & controllers **/
var application=require('../controllers/application.js');
var applicationrouter = express.Router();

applicationrouter.get('/',function(req,res,next){
    res.render('index',{title:application.name});
//  if(req.query.token==undefined){
//  	 res.render('index',{title:application.name});
//  }else{
//    var hour = 3600000;
//    req.session.token=req.query.token;  
//    req.session.save();
//    console.log(req.session.token);  
//    res.render('client',{title:application.name});
//      
//  }    
}).get('/client',function(req,res,next){
    res.render('client',{title:application.name});
}).get('/store',function(req,res,next){
    res.render('onlinestore',{title:application.name});
}).get('/app/user/:id/menu.html',function(req,res,next){
    res.render('user.id.menu',{title:application.name});
}).get('/store',function(req,res,next){
    res.render('onlinestore',{title:application.name});
});


module.exports = applicationrouter;