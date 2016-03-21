'use strict';

var express = require('express');
var path = require('path');

/** routers & controllers **/
var requestparameters=require('../bin/requestparameters.js');
var user=require('../controllers/user.js');
var order=require('../controllers/order.js');
var vendor=require('../controllers/vendor.js');
var router = express.Router();

/* Login API */
router
.post('/api/login/', function(req, res, next) {
  user.login(requestparameters.getPostParameters(req)).then(function(result){  
    res.json({rc:0,message:'welcome',data:{authkey:result.authkey}});  
  }).catch(function(err){
    res.json({rc:-1,message:'invalid user details'});
  });
})
.get('/api/vendors/',function(req,res,next){
  vendor.getVendorsForAPI().then(function(vendors){
    res.json({rc:0,data:vendors});
  });
})
.post('/api/orders/', function(req, res, next) {
  var params=requestparameters.getPostParameters(req);   
  if(params['authkey']==undefined || params['from']==undefined || params['to']==undefined){
      res.json({rc:-1,message:'required details are not provided'});
  }else{
      user.auth(params).then(function(currentuser){  
          order.get(params).then(function(orders){
             res.json({rc:0,message:'welcome',data:orders});  
          }).catch(function(err){
              res.json({rc:-1,message:'invalid user details',error:err});
          });

      }).catch(function(err){
        res.json({rc:-1,message:'invalid user details'});
      });      
  }    
})
.get('/api/orders/:id/details.json', function(req, res, next) {
  user.login(requestparameters.getPostParameters(req)).then(function(result){  
    res.json({rc:0,message:'welcome',data:{authkey:result.authkey}});  
  }).catch(function(err){
    res.json({rc:-1,message:'invalid user details'});
  });
})
.post('/api/orders/:orderid/vendor/:id/pickup.json', function(req, res, next) {
  user.login(requestparameters.getPostParameters(req)).then(function(result){  
    res.json({rc:0,message:'welcome',data:{authkey:result.authkey}});  
  }).catch(function(err){
    res.json({rc:-1,message:'invalid user details'});
  });
})
.post('/api/orders/:orderid/delivery.json', function(req, res, next) {
  user.login(requestparameters.getPostParameters(req)).then(function(result){  
    res.json({rc:0,message:'welcome',data:{authkey:result.authkey}});  
  }).catch(function(err){
    res.json({rc:-1,message:'invalid user details'});
  });
})
;


module.exports = router;
