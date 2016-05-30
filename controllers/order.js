'use strict';

var Promise = require("bluebird");

/** load models **/
var models = require('../models/index.js');
var crypto = require('crypto');
var dateutil = require('../bin/date.js');


var Order = {
    'get':function(options){
       return new Promise(function(resolve,reject) {
           models.Order.findAll({
                include:[
                {
                    model:models.OrderVendor,attributes:["id","VendorId","processedAt","status"],
                    include:[{
                       model:models.VendorContactAddressBook,attributes:["formattedaddress","city","country","phone","latitude","longitude"]
                    }]
                },
                {
                    model:models.CustomerContactAddressBook,attributes:["formattedaddress","phone","city","latitude","longitude"],
                },
                {
                    model:models.Employee,attributes:["name"],
                },                    
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
    'getForAPI':function(options){
       return new Promise(function(resolve,reject) {
           models.Order.findAll({
                include:[
                {
                    model:models.OrderVendor,attributes:["id","VendorId","processedAt","status"],
                    include:[{
                       model:models.VendorContactAddressBook,attributes:["formattedaddress","city","country","phone","latitude","longitude"]
                    }]
                },
                {
                    model:models.CustomerContactAddressBook,attributes:["formattedaddress","phone","city","latitude","longitude"],
                },
                {
                    model:models.Employee,attributes:["name"],
                },                    
               ],               
               where:{
                   isdeleted:0,
                   scheduleAt:{
                       $gte: options['from'],
                       $lte: options['to']
                   },
                   $or: [{EmployeeId: 0}, {EmployeeId: options['employeeid']}]
               },attributes:["id","scheduleAt","EmployeeId","status","createdAt","updatedAt"]
           }).then(function (orders) {
               resolve(orders);
           }).catch(function (error) {
               reject(error);
           });
       });        
    },
    'getToday':function(options){
       return new Promise(function(resolve,reject) {
 
           var _now=dateutil.now();
           models.Order.findAll({
                include:[
                {
                    model:models.OrderVendor,attributes:["id","VendorId","processedAt","status"],
                    include:[{
                       model:models.VendorContactAddressBook,attributes:["formattedaddress","city","country","phone","latitude","longitude"]
                    }]
                },
                {
                    model:models.CustomerContactAddressBook,attributes:["formattedaddress","phone","city","latitude","longitude"],
                },
                {
                    model:models.Employee,attributes:["name"],
                },                    
               ],               
               where:{
                   isdeleted:0,
                   scheduleAt:{
                       $gte: dateutil.getFormatDate(_now)+' 00:00:01',
                       $lte: dateutil.getFormatDate(_now)+' 23:59:59'
                   },
                   $or: [{EmployeeId: options['employeeid']}]
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
           var _where={isdeleted:0};
           var _vendor={isdeleted:0};
            
            
            if(options['id']){
                _vendor['OrderId']=options['id'];
                _where['id']=options['id'];
            };
            
            if(options['EmployeeId']){
                _where['EmployeeId']=options['EmployeeId'];
                _vendor['EmployeeId']=options['EmployeeId'];
            };

            if(options['VendorId']){
                _vendor['VendorId']=options['VendorId'];
            };
           
           models.Order.findOne({
                include:[
                {
                    model:models.OrderVendor,attributes:["id","VendorId","processedAt","status"],
                    include:[{
                         model:models.OrderVendorItem, attributes:["productName","quantity","measureunit"]
                    },{
                       model:models.VendorContactAddressBook,attributes:["formattedaddress","city","country","phone","latitude","longitude"]
                    },{
                       model:models.OrderSignature,attributes:["id","status"] 
                    },
                     {
                       model:models.Vendor,attributes:["name"]
                    }],
                    where:_vendor
                },
                {
                    model:models.Customer,attributes:["id","name"],
                },
                {
                    model:models.CustomerContactAddressBook,attributes:["formattedaddress","phone","city","latitude","longitude"],
                },
                {
                    model:models.Employee,attributes:["name"],
                },                    
                    
               ],
               
               where:_where
               ,attributes:["id","name","EmployeeId","CustomerId","status","scheduleAt","deliveryAt"]
           }).then(function (orders) {
               resolve(orders);
           }).catch(function (error) {
               reject(error);
           });
       });        
    },
    'getByEmployeeID':function(options){
       return new Promise(function(resolve,reject) {
           models.Order.findAll({
                include:[
                {
                    model:models.OrderVendor,attributes:["id","VendorId","processedAt","status"],
                    include:[{
                       model:models.VendorContactAddressBook,attributes:["formattedaddress","city","country","phone","latitude","longitude"]
                    }]
                },
                {
                    model:models.CustomerContactAddressBook,attributes:["formattedaddress","phone","city","latitude","longitude"],
                },
                {
                    model:models.Employee,attributes:["name"],
                },                    
               ],               
               where:{
                   isdeleted:0,
                   scheduleAt:{
                       $gte: options['from'],
                       $lte: options['to']
                   },
                   $or: [{EmployeeId: options['id']}]
               },attributes:["id","scheduleAt","EmployeeId","status","createdAt","updatedAt","deliveryAt"]
           }).then(function (orders) {
               resolve(orders);
           }).catch(function (error) {
               reject(error);
           });
       });        
    },    
    'getByVendorId':function(options){
       return new Promise(function(resolve,reject) {
           models.Order.findAll({
                include:[
                {
                    model:models.OrderVendor,attributes:["id","VendorId","status"],
                    where:{
                       VendorId:options['id']
                    }
                },
                {
                    model:models.Employee,attributes:["name"],
                }
               ]
               ,attributes:["id","name","EmployeeId","CustomerId","status","scheduleAt","deliveryAt"]
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
    'addPickupsignature':function(orderid,vendorid,employeeId,vendorsign,empsign){
        return new Promise(function(resolve,reject) {
            models.OrderVendor.findOne({
                where:{OrderId:orderid,VendorId:vendorid,EmployeeId:employeeId},
                attributes:["id"]
            }).then(function(ordervendor){
                models.OrderSignature.update({
                    EmployeeId:employeeId,
                    VendorPickupSignature:vendorsign,
                    EmployeePickupSignature:empsign,
                    status:'picked'
                },{
                    where:{OrderId:orderid,OrderVendorId:ordervendor.id}
                }).then(function (affectedrows) {
                    ordervendor.update({status:'picked'}).then(function(affectedrows){
                        models.Order.findAll({
                            include:{
                                model:models.OrderVendor,attributes:["id","status"],where:{
                                    status:'assigned'
                                }
                            },attributes:["id"],
                            where:{id:orderid},
                        }).then(function(order){
                            if(order && order.length==0){
                                models.Order.update({status:'pick up complete'},{where:{id:orderid}}).then(function(a){
                                    resolve(a);
                                });                            
                            }else{
                                resolve(1);
                            }
                        });
                    });
                });
            }).catch(function(error){
                reject(error);
            });  
        });    
    },
    'addDeliverysignature':function(orderid,customerid,employeeId,customersign,empsign){
        return new Promise(function(resolve,reject) {
            models.OrderSignature.update({
                EmployeeId:employeeId,
                CustomerDeliverySignature:customersign,
                EmployeeDeliverySignature:empsign,
                status:'delivered'
            },{
                where:{OrderId:orderid,CustomerId:customerid}
            }).then(function (affectedrows) {
                models.Order.update({status:'delivered'},{where:{
                        id:orderid,
                        EmployeeId:employeeId,
                        CustomerId:customerid,
                        status:'pick up complete'
                }}).then(function(a){
                    resolve(a);
                });
            }).catch(function (error) {
                    console.log(error);
                    reject(error);
            });
        });        
    },
    'setOrderToPickup':function(orderid,employeeId){
        return new Promise(function(resolve,reject) {
            models.Order.update({
                EmployeeId:employeeId,
                status:'assigned'
            },{
                where:{id:orderid,EmployeeId:0}
            }).then(function (affectedrows) {
                    models.OrderVendor.update({EmployeeId:employeeId,status:'assigned'},{where:{OrderId:orderid}});
                    resolve(affectedrows);
            }).catch(function (error) {
                    console.log(error);
                    reject(error);
            });
        });
    },
    'getStatus':function(orderid){
       return new Promise(function(resolve,reject) {
           models.Order.findOne({
                include:[
                {
                    model:models.OrderVendor,attributes:["id","VendorId","processedAt","status"],
                    include:[
                     {
                       model:models.Vendor,attributes:["name"]
                    }]
                },
                {
                    model:models.Customer,attributes:["id","name"],
                },
                {
                    model:models.Employee,attributes:["name"],
                },                    
                    
               ],
               where:{
                   isdeleted:0,
                   id:options['id']
               }
               ,attributes:["id","name","EmployeeId","CustomerId","status","scheduleAt","deliveryAt"]
           }).then(function (orders) {
               resolve(orders);
           }).catch(function (error) {
               reject(error);
           });
       });        
    },
    'getPickupStatus':function(options){
       return new Promise(function(resolve,reject) {
           models.Order.findOne({
                include:[
                {
                    model:models.OrderVendor,attributes:["id","VendorId","processedAt","status"],
                    include:[
                     {
                       model:models.Vendor,attributes:["name"]
                    }],where:{status:'ready'}
                },
                {
                    model:models.Customer,attributes:["id","name"],
                },
                {
                    model:models.Employee,attributes:["name"],
                },                    
                    
               ],
               where:{
                   isdeleted:0,
                   id:options['id'],
                   EmployeeId: options['employeeid']
               }
               ,attributes:["id","name","EmployeeId","CustomerId","status","scheduleAt","deliveryAt"]
           }).then(function (orders) {
               resolve(orders);
           }).catch(function (error) {
               reject(error);
           });
       });        
    },
    'confirmOrderFromVendor':function(options){
        return new Promise(function(resolve,reject) {
            models.OrderVendor.update({
                status:'confirmed',
                processedAt:dateutil.now()
            },{
                where:{OrderId:options['OrderId'],VendorId:options['VendorId']}
            }).then(function (affectedrows) {
                    resolve(affectedrows);
            }).catch(function (error) {
                    console.log(error);
                    reject(error);
            });
        });        
    }
}

module.exports = Order;