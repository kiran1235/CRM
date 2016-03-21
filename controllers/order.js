'use strict';

var Promise = require("bluebird");

/** load models **/
var models = require('../models/index.js');
var crypto = require('crypto');
var Order = {
    'get':function(options){
       return new Promise(function(resolve,reject) {
           models.Order.findAll({
               where:{
                   isdeleted:0,
                   scheduleAt:{
                       $gte: options['from'],
                       $lte: options['to']
                   }
               }
           }).then(function (orders) {
               resolve(orders);
           }).catch(function (error) {
               reject(error);
           });
       });        
    },    
    'getById':function(options){
       return new Promise(function(resolve,reject) {
           models.Order.findOne({
                include:[
                {
                    model:models.Vendor,attributes:["name"]
                },
                {
                    model:models.VendorContactAddressBook,attributes:["formattedaddress","phone","latitude","longitude"]
                },
                {
                    model:models.OrderVendorItem,attributes:["productName","quantity","measureunit"]
                },
                {
                    model:models.CustomerAddressBook,attributes:["city"]
                }               
               ],
               where:{
                   isdeleted:0,
                   id:options['id']
               }
           }).then(function (orders) {
               resolve(orders);
           }).catch(function (error) {
               reject(error);
           });
       });        
    },
    'create':function(options){
        
    }
}

module.exports = Order;