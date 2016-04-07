'use strict';

var Promise = require("bluebird");

/** load models **/
var models = require('../models/index.js');


var Vendor = {
    'get':function(options){
       return new Promise(function(resolve,reject) {
           models.Vendor.findAll({
             attributes:["id","name"]
           }).then(function (vendors) {
               resolve(vendors);
           }).catch(function (error) {
               reject(error);
           });
       });
    },
    'getVendorsForAPI':function(options){
       return new Promise(function(resolve,reject) {
           models.Vendor.findAll({
            include:[
                  {
                    model: models.VendorContact,
                    include:{
                      model:models.VendorContactAddressBook,
                        attributes:["phone","formattedaddress","latitude","longitude"],order:'id desc'
                    },attributes:["id","isprimary"],where:{
                        isdeleted:0
                    }
                  },
                ],              
             attributes:["id","name"]
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
                include:[
                  {
                    model: models.VendorContact,
                    include:{
                      model:models.VendorContactAddressBook
                    }
                  },
                ]
              ,where: {id: id}
            }).then(function (vendor) {
                if(vendor.length<=0){
                    throw new Error("Vendor Not Found");
                }else{
                    resolve(vendor);
                }
            }).catch(function (error) {
                reject(error);
            });
        });
    },
    'getByIdForAPI':function(id){
        return new Promise(function(resolve,reject) {
            models.Vendor.findOne({
                include:[
                  {
                    model: models.VendorContact,
                    include:{
                      model:models.VendorContactAddressBook,
                      attributes:["phone","formattedaddress","latitude","longitude"],order:'id desc'

                    },attributes:["id","isprimary"],where:{
                        isdeleted:0
                    }
                  },
                ]
              ,where: {id: id}
            }).then(function (vendor) {
                if(vendor.length<=0){
                    throw new Error("Vendor Not Found");
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
    'update':function(id,values){
        return new Promise(function(resolve,reject) {
            models.Vendor.update(values, {
                where:{id:id}
            }).then(function (affectedrows) {
                if(affectedrows>=1){
                    resolve(vendor);
                }else{
                    throw new Error("Vendor Not Found");
                }
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
        return new Promise(function(resolve,reject) {
            vendor.destroy().then(function(vendor){
                resolve(vendor);
            }).catch(function(error){
                reject(error);
            });
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
                    throw new Error("vendor address not found");
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
    'updateVendorAddressBook':function(vendorid,id,values){
        return new Promise(function(resolve,reject) {
            models.VendorAddressBook.update(values,{where:{VendorId: vendorid,id:id}}).then(function(affectedrows){
                if(affectedrows<=0){
                    throw new Error("Vendor Address Not Found");
                }else{
                    resolve(affectedrows);
                }
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
                if(!vendor || vendor.length<=0){
                    throw new Error("no vendor found");
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
                if(!contact || contact.length<=0){
                    throw new Error("no contact found");
                }else{
                    resolve(contact);
                }
            }).catch(function(error){
                reject(error);
            });
        });
    },
    'addContact':function(vendor,options){
        return new Promise(function(resolve,reject) {
            vendor.createVendorContact({
                name: options['name']
            }).then(function (contact) {
                resolve(contact);
            }).catch(function (error) {
                reject(error);
            });
        });
    },
    'updateContact':function(vendorid,id,values){
        return new Promise(function(resolve,reject) {
            models.VendorContact.update(values,{where:{
                VendorId: vendorid,
                  id:id
            }}).then(function(affectedrows){
                if(affectedrows<=0){
                    throw new Error("Vendor Contact Not Found");
                }else{
                    resolve(affectedrows);
                }
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
        options['isprimary']=(options['isprimary']==undefined)?0:options['isprimary'];
        options['isdeleted']=(options['isdeleted']==undefined)?0:options['isdeleted'];
        return new Promise(function(resolve,reject) {
            vendorcontact.createVendorContactAddressBook(options).then(function(v){
                resolve(v);
            }).catch(function(error){
                reject(error);
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
    },
    'updateContactAddressBook':function(vendorcontactid,id,values){
        return new Promise(function(resolve,reject) {
            models.VendorContactAddressBook.update(values,{where:{VendorContactId: vendorcontactid,id:id}}).then(function(affectedrows){
                if(affectedrows<=0){
                    throw new Error("Vendor Contact Address Not Found");
                }else{
                    resolve(affectedrows);
                }
            }).catch(function(error){
                reject(error);
            });
        });
    },

    'getProducts':function(id){
      return new Promise(function(resolve,reject) {
        models.Product.findAll({
          include:[
            {
              model: models.Inventory,
            },
            {
              model: models.Vendor,
              where:{
                id:id
              }
            },
          ]
        }).then(function (product) {
          if(product.length<=0){
            throw new Error("Products are not Found");
          }else{
            resolve(product);
          }
        }).catch(function (error) {
          reject(error);
        });
      });
    },
    'addProduct':function(id,options){
      return new Promise(function(resolve,reject) {

        models.Vendor.findOne({
          attributes:["id"],
          where:{id:id}
        }).then(function(vendor){
          if(vendor.length<=0){
            throw new Error("Vendor not Found");
          }else{
            vendor.createProduct(options).then(function(product){
              resolve(product);
            }).catch(function(err){
              console.log(err);
              reject(err);
            });
          }
        }).catch(function(err){
          reject(err);
        });


        //models.Product.findAll({
        //  include:[
        //    {
        //      model: models.Inventory,
        //    },
        //    {
        //      model: models.Vendor,
        //      where:{
        //        id:id
        //      }
        //    },
        //  ]
        //}).then(function (product) {
        //  if(product.length<=0){
        //    throw new Error("Products are not Found");
        //  }else{
        //    resolve(product);
        //  }
        //}).catch(function (error) {
        //  reject(error);
        //});
      });
    }




}

module.exports = Vendor;
