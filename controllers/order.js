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
    'generate':function(len){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for( var i=0; i < len; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    },
    'create':function(options){
        return new Promise(function(resolve,reject) {
            
            models.Order.create(options).then(function(neworder){
                var _nitems=options.items.length;
                for(var _i=0;_i<_nitems;_i++){
                    var item = options.items[_i];
                    neworder.createOrderVendor({
                        name:neworder.name,
                        VendorId:item.Vendors[0].ProductVendor.VendorId,
                        VendorContactAddressBookId:0
                    }).then(function(newordervendor){
                        newordervendor.createOrderVendorItem({
                            OrderId:neworder.id,
                            InventoryId:item.Inventories[0].id,
                            ProductId:item.id,
                            productName:item.name,
                            unitprice:item.Inventories[0].unitprice,
                            vat:0,
                            discountamount:0,
                            quantity:item.cartquantity,
                            measureunit:item.model,
                            status:'new',
                            isdeleted:0
                        }).then(function(newordervendoritem){
                        }).catch(function(err){
                            reject(err);
                        });
                    }).catch(function(err){
                        console.log(err);
                        reject(err);
                    });
                }
                resolve(neworder);

            }).catch(function (error) {
                   reject(error);
            });
        });
    }
}

module.exports = Order;