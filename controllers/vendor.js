'use strict';

var Promise = require("bluebird");

/** load models **/
var models = require('../models/index.js');


var Vendor = {
    'get':function(options){
       return new Promise(function(resolve,reject) {
           models.Vendor.findAll({
           }).then(function (vendors) {
               resolve(vendors);
           }).catch(function (error) {
               reject(error);
           });
       });
    },
    'getById':function(id){
        return new Promise(function(resolve,reject) {
            models.Vendor.findOne({
                where: {id: id}
            }).then(function (vendor) {
                resolve(vendor);
            }).catch(function (error) {
                reject(error);
            });
        });
    },
    'create':function(options){
        return new Promise(function(resolve,reject) {
            models.Vendor.create({
                name: options['name']
            }).then(function (vendor) {
                resolve(vendor);
            }).catch(function(error){
                reject(error);
            });
        });
    },
    'update':function(options){
        return new Promise(function(resolve,reject) {
            models.Vendor.findOne({
                where:{id:[options['id']]}
            }).then(function(vendor){
                vendor.update({
                    name: options['name']
                }).then(function (vendor) {
                    resolve(vendor);
                }).catch(function(error){
                    reject(error);
                });
            }).catch(function(error){
                reject(error);
            });
        });
    },
    'delete':function(options){
        return new Promise(function(resolve,reject) {
            models.Vendor.destroy({
                where:{id:[options['id']]}
            }).then(function(vendor){
                resolve(vendor);
            }).catch(function(error){
                reject(error);
            });
        });
    },
    'destory':function(vendor){
        return vendor.destroy().then(function(vendor){
                resolve(vendor);
            }).catch(function(error){
                reject(error);
            });
    },
    'getAddressBookByVendorId':function(id){
        return new Promise(function(resolve,reject){
            models.Vendor.findAll({include:{
                model:models.VendorAddressBook
            },attributes:["id","name"],
                where:{
                    id:[
                        id
                    ]
                }
            }).then(function(vendor){
                if(vendor.length<=0){
                    throw new Error("no address found");
                }else{
                    resolve(vendor);
                }
            }).catch(function(error){
                reject(error);
            });
        });
    },
    'addAddressBook':function(vendor,options){
        return new Promise(function(resolve,reject) {
            vendor.createVendorAddressBook(options).then(function(v){
                resolve(v);
            }).catch(function(error){
                reject(error);
            });
        });
    },
    'getContactByVendorId':function(id){
        return new Promise(function(resolve,reject){
            models.Vendor.findAll({include:{
                model:models.VendorContact
            },attributes:["id","name"],
                where:{
                    id:[
                        id
                    ]
                }
            }).then(function(vendor){
                if(vendor.length<=0){
                    throw new Error("no contact found");
                }else{
                    resolve(vendor);
                }
            }).catch(function(error){
                reject(error);
            });
        });
    },
    'addContact':function(options){
        return new Promise(function(resolve,reject) {
            models.Vendor.findOne({
                where:{id:[options['id']]}
            }).then(function(vendor){
                vendor.createVendorContact({
                    name: options['name']
                }).then(function (vendor) {
                    resolve(vendor);
                }).catch(function(error){
                    reject(error);
                });
            }).catch(function(error){
                reject(error);
            });
        });
    },
    'addContactAddressBook':function(vendorcontact,options){
        return new Promise(function(resolve,reject) {
            vendorcontact.createVendorContactAddressBook(options).then(function(v){
                resolve(v);
            }).catch(function(error){
                vendorcontact.destroy().then(function(d){
                    resolve(error);
                });
            });
        });
    }
}

module.exports = Vendor;
