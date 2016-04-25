'use strict';

var Promise = require("bluebird");

/** load models **/
var models = require('../models/index.js');


var Customer = {
    'get':function(options){
       return new Promise(function(resolve,reject) {
           models.Customer.findAll({
            include:[
                  {
                    model: models.CustomerContact,
                    include:{
                      model:models.CustomerContactAddressBook,
                        attributes:["phone","formattedaddress","city","zipcode"],order:'id desc'
                    },attributes:["id","isprimary"],where:{
                        isdeleted:0
                    }
                  },
                ],              
             attributes:["id","name"]
           }).then(function (Customers) {
               resolve(Customers);
           }).catch(function (error) {
               reject(error);
           });
       });
    },
    'getCustomersForAPI':function(options){
       return new Promise(function(resolve,reject) {
           models.Customer.findAll({
            include:[
                  {
                    model: models.CustomerContact,
                    include:{
                      model:models.CustomerContactAddressBook,
                        attributes:["id","phone","formattedaddress","latitude","longitude"],order:'id desc'
                    },attributes:["id","isprimary"],where:{
                        isdeleted:0
                    }
                  },
                ],              
             attributes:["id","name"]
           }).then(function (Customers) {
               resolve(Customers);
           }).catch(function (error) {
               reject(error);
           });
       });
    },    
    'getById':function(id){
        return new Promise(function(resolve,reject) {
            models.Customer.findOne({
                include:[
                  {
                    model: models.CustomerContact,
                    include:{
                      model:models.CustomerContactAddressBook
                    }
                  },
                ]
              ,where: {id: id}
            }).then(function (Customer) {
                if(Customer.length<=0){
                    throw new Error("Customer Not Found");
                }else{
                    resolve(Customer);
                }
            }).catch(function (error) {
                reject(error);
            });
        });
    },
    'getByIdForAPI':function(id){
        return new Promise(function(resolve,reject) {
            models.Customer.findOne({
                include:[
                  {
                    model: models.CustomerContact,
                    include:{
                      model:models.CustomerContactAddressBook,
                      attributes:["phone","formattedaddress","latitude","longitude"],order:'id desc'

                    },attributes:["id","isprimary"],where:{
                        isdeleted:0
                    }
                  },
                ]
              ,where: {id: id}
            }).then(function (Customer) {
                if(Customer.length<=0){
                    throw new Error("Customer Not Found");
                }else{
                    resolve(Customer);
                }
            }).catch(function (error) {
                reject(error);
            });
        });
    }, 
    'create':function(options){
        return new Promise(function(resolve,reject) {
            models.Customer.create({
                name: options['name']
            }).then(function (customer) {
                resolve(customer);
            }).catch(function(error){
                reject(error);
            });
        });
    },
    'update':function(id,values){
        return new Promise(function(resolve,reject) {
            models.Customer.update(values, {
                where:{id:id}
            }).then(function (affectedrows) {
                if(affectedrows>=1){
                    resolve(customer);
                }else{
                    throw new Error("Customer Not Found");
                }
            }).catch(function(error){
                reject(error);
            });
        });
    },
    'delete':function(id){
        return new Promise(function(resolve,reject) {
            models.Customer.destroy({
                where:{id:id}
            }).then(function(customer){
                resolve(customer);
            }).catch(function(error){
                reject(error);
            });
        });
    },
    'destroy':function(customer){
        return customer.destroy().then(function(customer){
                resolve(customer);
            }).catch(function(error){
                reject(error);
            });
    },
    'getAddressBookByCustomerId':function(id){
        return new Promise(function(resolve,reject){
            models.Customer.findAll({include:{
                model:models.CustomerAddressBook
            },attributes:["id","name"],
                where:{
                    id:[
                        id
                    ]
                }
            }).then(function(customer){
                if(customer.length<=0){
                    throw new Error("customer address not found");
                }else{
                    resolve(customer);
                }
            }).catch(function(error){
                reject(error);
            });
        });
    },
    'getCustomerAddressBookById':function(customerid,id){
        return new Promise(function(resolve,reject){
            models.CustomerAddressBook.findOne({
                where:{
                    CustomerId: customerid,
                    id:id
                }
            }).then(function(address){
                if(address.length<=0){
                    throw new Error("no customer address found");
                }else{
                    resolve(address);
                }
            }).catch(function(error){
                reject(error);
            });
        });
    },
    'addAddressBook':function(customer,options){
        return new Promise(function(resolve,reject) {
            customer.createCustomerAddressBook(options).then(function(v){
                resolve(v);
            }).catch(function(error){
                reject(error);
            });
        });
    },
    'deleteCustomerAddressBook':function(address){
        return new Promise(function(resolve,reject) {
            address.destroy().then(function(v){
                resolve(v);
            }).catch(function(error){
                resolve(error);
            });
        });
    },
    'updateCustomerAddressBook':function(customerid,id,values){
        return new Promise(function(resolve,reject) {
            models.CustomerAddressBook.update(values,{where:{CustomerId: customerid,id:id}}).then(function(affectedrows){
                if(affectedrows<=0){
                    throw new Error("Customer Address Not Found");
                }else{
                    resolve(affectedrows);
                }
            }).catch(function(error){
                reject(error);
            });
        });
    },
    'getContactByCustomerId':function(id){
        return new Promise(function(resolve,reject){
            models.Customer.findAll({include:{
                model:models.CustomerContact
            },attributes:["id","name"],
                where:{
                    id:[
                        id
                    ]
                }
            }).then(function(customer){
                if(!customer || customer.length<=0){
                    throw new Error("no customer found");
                }else{
                    resolve(customer);
                }
            }).catch(function(error){
                reject(error);
            });
        });
    },
    'getContactById':function(customerid,contactid){
        return new Promise(function(resolve,reject){
            models.CustomerContact.findOne({attributes:["id","name"],
                where:{
                    CustomerId: customerid,
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
    'addContact':function(customer,options){
        return new Promise(function(resolve,reject) {
            customer.createCustomerContact({
                name: options['name']
            }).then(function (customer) {
                resolve(customer);
            }).catch(function (error) {
                reject(error);
            });
        });
    },
    'updateContact':function(customerid,id,values){
        return new Promise(function(resolve,reject) {
            models.CustomerContact.update(values,{where:{
                CustomerId: customerid,
                  id:id
            }}).then(function(affectedrows){
                if(affectedrows<=0){
                    throw new Error("Customer Contact Not Found");
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
    'getAddressBookByContactId':function(customerid,contactid){
        return new Promise(function(resolve,reject){
            models.CustomerContact.findAll({include:{
                model:models.CustomerContactAddressBook
            },attributes:["id","name"],
                where:{
                    CustomerId: customerid,
                    id:contactid
                }
            }).then(function(customer){
                if(customer.length<=0){
                    throw new Error("no address found");
                }else{
                    resolve(customer);
                }
            }).catch(function(error){
                reject(error);
            });
        });
    },
    'getContactAddressBookById':function(customercontactid,id){
        return new Promise(function(resolve,reject){
            models.CustomerContactAddressBook.findOne({
                where:{
                    CustomerContactId: customercontactid,
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
    'addContactAddressBook':function(customercontact,options){
        return new Promise(function(resolve,reject) {
            customercontact.createCustomerContactAddressBook(options).then(function(v){
                resolve(v);
            }).catch(function(error){
               
                customercontact.destroy().then(function(d){
                    
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
    },
    'updateContactAddressBook':function(customercontactid,id,values){
        return new Promise(function(resolve,reject) {
            models.CustomerContactAddressBook.update(values,{where:{CustomerContactId: customercontactid,id:id}}).then(function(affectedrows){
                if(affectedrows<=0){
                    throw new Error("Customer Contact Address Not Found");
                }else{
                    resolve(affectedrows);
                }
            }).catch(function(error){
                reject(error);
            });
        });
    },

}

module.exports = Customer;
