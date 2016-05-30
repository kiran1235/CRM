/**
 * Created by talapaku on 12/7/2015.
 */

'use strict';

var express = require('express');
var path = require('path');
var requestparameters=require('../bin/requestparameters.js');
var dateutil = require('../bin/date.js');

/** routers & controllers **/
var order=require('../controllers/order.js');
var orderrouter = express.Router();
orderrouter.get('/orders/',function(req,res,next){
  var _now=dateutil.now();
 var _from=dateutil.getFormatDate(_now);  
 var _to=dateutil.getFormatDate(dateutil.addDays(_now,15));
  order.get({
      from: '01/01/2015',
      to:_to,
  }).then(function(orders){
    res.json({rc:0,data:orders});
  });
}).get('/orders/:id',function(req,res,next){
  order.getById({id:req.params.id}).then(function(order){
    res.json({rc:0,data:order});
  });
}).get('/orders/vendors/:id',function(req,res,next){
  order.getByVendorId({id:req.params.id}).then(function(orders){
    res.json({rc:0,data:orders});
  });
})

;
module.exports = orderrouter;
