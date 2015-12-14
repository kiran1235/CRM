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
                if(vendor.length<=0){
                    throw new Error("no vendor found");
                }else{
                    resolve(vendor);
                }
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
    'delete':function(id){
        return new Promise(function(resolve,reject) {
            models.Vendor.destroy({
                where:{id:id}
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
    'getVendorAddressBookById':function(vendorid,id){
        return new Promise(function(resolve,reject){
            models.VendorAddressBook.findOne({
                where:{
                    VendorId: vendorid,
                    id:id
                }
            }).then(function(address){
                if(address.length<=0){
                    throw new Error("no vendor address found");
                }else{
                    resolve(address);
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
    'deleteVendorAddressBook':function(address){
        return new Promise(function(resolve,reject) {
            address.destroy().then(function(v){
                resolve(v);
            }).catch(function(error){
                resolve(error);
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
    'getContactById':function(vendorid,contactid){
        return new Promise(function(resolve,reject){
            models.VendorContact.findOne({attributes:["id","name"],
                where:{
                    VendorId: vendorid,
                    id:contactid
                }
            }).then(function(contact){
                if(contact.length<=0){
                    throw new Error("no contact found");
                }else{
                    resolve(contact);
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
    'deleteContact':function(contact){
        return new Promise(function(resolve,reject) {
            contact.destroy().then(function(v){
                resolve(v);
            }).catch(function(error){
                resolve(error);
            });
        });
    },
    'getAddressBookByContactId':function(vendorid,contactid){
        return new Promise(function(resolve,reject){
            models.VendorContact.findAll({include:{
                model:models.VendorContactAddressBook
            },attributes:["id","name"],
                where:{
                    VendorId: vendorid,
                    id:contactid
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
    'getContactAddressBookById':function(vendorcontactid,id){
        return new Promise(function(resolve,reject){
            models.VendorContactAddressBook.findOne({
                where:{
                    VendorContactId: vendorcontactid,
                    id:id
                }
            }).then(function(address){
                if(address.length<=0){
                    throw new Error("no contact address found");
                }else{
                    resolve(address);
                }
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
    },
    'deleteContactAddressBook':function(address){
        return new Promise(function(resolve,reject) {
            address.destroy().then(function(v){
                resolve(v);
            }).catch(function(error){
                    resolve(error);
            });
        });
    }
}

module.exports = Vendor;
