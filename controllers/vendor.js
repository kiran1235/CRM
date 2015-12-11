'use strict';

var Promise = require("bluebird");

/** load models **/
var models = require('../models/index.js');


var Vendor = {
    'get':function(options){
        return new Promise(function(resolve,reject){
            models.Vendor.findAll({
                attributes:["id","name"]
            }).then(function(vendors){
                resolve(vendors);
            }).catch(function(error){
                reject(error);
            });
        });
    },
    'getAddressBookById':function(id){
        return new Promise(function(resolve,reject){
           models.Vendor.findAll({include:{
               model:models.VendorAddressBook
           },attributes:["id","name"],
               where:{
                   id:[
                       id
                   ]
               }
           }).then(function(vendors){
               resolve(vendors);
           }).catch(function(error){
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
    'addAddressBook':function(options){
        return new Promise(function(resolve,reject) {
            models.Vendor.findOne({
                where:{id:[options['id']]}
            }).then(function(vendor){
                vendor.createVendorAddressBook({
                    addressline1:options['addressline1'],
                    addressline2:options['addressline2'],
                    street:options['street'],
                    City:options['City'],
                    Country:options['Country'],
                    Zipcode:options['Zipcode']
                }).then(function(v){
                    resolve(v);
                }).catch(function(error){
                    reject(error);
                });
            });
        });
    },
    'addContactAddressBook':function(options){
        return new Promise(function(resolve,reject) {
            models.VendorContact.findOne({
                where:{id:[options['id']]}
            }).then(function(vendor){
                vendor.createVendorContactAddressBook({
                    addressline1:options['addressline1'],
                    addressline2:options['addressline2'],
                    street:options['street'],
                    City:options['City'],
                    Country:options['Country'],
                    Zipcode:options['Zipcode']
                }).then(function(v){
                    resolve(v);
                }).catch(function(error){
                    reject(error);
                });
            });
        });
    },
    'delete':function(){

    },
    'update':function(){

    }
}

module.exports = Vendor;
