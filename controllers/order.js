'use strict';

var Promise = require("bluebird");

/** load models **/
var models = require('../models/index.js');
var crypto = require('crypto');
var Order = {
    'get':function(options){
       return new Promise(function(resolve,reject) {
           models.Order.findAll({
                include:[
                {
                    model:models.OrderVendor,attributes:["VendorId","processedAt","status"],
                    include:[{
                       model:models.VendorContactAddressBook,attributes:["formattedaddress","city","country","phone","latitude","longitude"]
                    }]
                },
                {
                    model:models.CustomerContactAddressBook,attributes:["formattedaddress","phone","city","latitude","longitude"],
                }
               ],               
               where:{
                   isdeleted:0,
                   scheduleAt:{
                       $gte: options['from'],
                       $lte: options['to']
                   }
               },attributes:["id","scheduleAt","EmployeeId","status","createdAt","updatedAt"]
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
                    model:models.OrderVendor,attributes:["VendorId","processedAt","status"],
                    include:[{
                         model:models.OrderVendorItem, attributes:["productName","quantity","measureunit"]
                    },{
                       model:models.VendorContactAddressBook,attributes:["formattedaddress","city","country","phone","latitude","longitude"]
                    },{
                       model:models.OrderSignature,attributes:["id","status"] 
                    }]
                },
                {
                    model:models.Customer,attributes:["id","name"],
                },
                    {
                        model:models.CustomerContactAddressBook,attributes:["formattedaddress","phone","city","latitude","longitude"],
                    }
                    
               ],
               
               where:{
                   isdeleted:0,
                   id:options['id']
               }
               ,attributes:["name","EmployeeId","CustomerId","status","scheduleAt","deliveryAt"]
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
    'addVendorItem':function(newordervendor,item){
            newordervendor.createOrderVendorItem(item).then(function(newordervendoritem){
                }).catch(function(err){
                    console.log(err);
                });        
    },
    'addItem':function(neworder,item){
        neworder.createOrderVendor({
            name:item.name,
            VendorId:item.id,
            VendorContactAddressBookId:item.vendorcontactaddressbookid
        }).then(function(newordervendor){
            
            newordervendor.createOrderSignature({
                EmployeeId:0,
                OrderId:neworder.id,
                CustomerId:neworder.CustomerId,
                status:'not captured'
            });
            
            var vendoritems=[];
            var _n=item.Products.length;
            for(var _i=0;_i<_n;_i++){
                vendoritems.push(Order.addVendorItem(newordervendor,{
                    OrderId:neworder.id,
                    InventoryId:item.Products[_i].Inventories[0].id,
                    ProductId:item.Products[_i].id,
                    productName:item.Products[_i].name,
                    unitprice:item.Products[_i].Inventories[0].unitprice,
                    vat:0,
                    discountamount:0,
                    quantity:item.Products[_i].cartquantity,
                    measureunit:item.Products[_i].model,
                    status:'new',
                    isdeleted:0
                }));
            }
            
            Promise.all(vendoritems).then(function(){
              console.log("resovled all vendoritems");    
            });

        }).catch(function(err){
            console.log(err);
        });        
    },
    'create':function(options){
        return new Promise(function(resolve,reject) {
            models.Order.create(options).then(function(neworder){
                var _vendors=[];
                var _nitems=options.items.length;
                for(var _j=0;_j<_nitems;_j++){
                    _vendors.push(Order.addItem(neworder,options.items[_j]));
                }
                
                Promise.all(_vendors).then(function(){
                    console.log("resolved");
                    resolve(neworder);
                });
                
            }).catch(function (error) {
                    console.log(error);
            });
        });
    },
    'addPickupsignature':function(orderid,signid,employeeId,vendorsign,empsign){
        return new Promise(function(resolve,reject) {
            models.OrderSignature.update({
                EmployeeId:employeeId,
                VendorPickupSignature:vendorsign,
                EmployeePickupSignature:empsign,
                status:'pickup complete'
            },{
                where:{id:signid}
            }).then(function (affectedrows) {
                    models.Order.update({status:'pickup complete'},{where:{id:orderid}}).then(function(a){
                        resolve(a);
                    });
                
            }).catch(function (error) {
                    console.log(error);
                    reject(error);
            });
        });        
    },
    'addDeliverysignature':function(orderid,signid,employeeId,customersign,empsign){
        return new Promise(function(resolve,reject) {
            models.OrderSignature.update({
                EmployeeId:employeeId,
                CustomerDeliverySignature:customersign,
                EmployeeDeliverySignature:empsign,
                status:'delivery complete'
            },{
                where:{id:signid}
            }).then(function (affectedrows) {
                    models.Order.update({status:'delivery complete'},{where:{id:orderid}}).then(function(a){
                        resolve(a);
                    });
                
            }).catch(function (error) {
                    console.log(error);
                    reject(error);
            });
        });        
    }
}

module.exports = Order;