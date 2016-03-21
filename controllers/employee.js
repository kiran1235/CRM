'use strict';

var Promise = require("bluebird");

/** load models **/
var models = require('../models/index.js');
var crypto = require('crypto');

var Employee = {
    'get':function(options){
       return new Promise(function(resolve,reject) {
           models.Employee.findAll({
             attributes:["id","name","email"],
               where:{isdeleted:0}
           }).then(function (employees) {
               resolve(employees);
           }).catch(function (error) {
               reject(error);
           });
       });
    },
    'getById':function(id){
        return new Promise(function(resolve,reject) {
            models.Employee.findOne({
                include:[
                  {
                    model: models.EmployeeAddressBook,
                  },
                ]
              ,where: {id: id}
            }).then(function (employee) {
                if(!employee){
                    throw new Error("Employee Not Found");
                }else{
                    resolve(employee);
                }
            }).catch(function (error) {
                console.log("ddd");
                reject(error);
            });
        });
    },
    'create':function(options){
        return new Promise(function(resolve,reject) {
            models.Employee.create(options).then(function (employee) {
                models.User.create({
                    'email':options['email'],
                    'hashkey':crypto.createHash('md5').update(options['email']+'&'+options['password']).digest('hex'),
                    'parentId':'employee',
                    'authkey':crypto.createHash('md5').update(options['email']+'&'+options['password']).digest('hex')
                }).then(function (user) {
                    resolve(employee);
                }).catch(function(error){
                    reject(error);
                });                
            }).catch(function(error){
                reject(error);
            });
        });
    },
    'update':function(id,values){
        return new Promise(function(resolve,reject) {
            models.Employee.update(values, {
                where:{id:id}
            }).then(function (affectedrows) {
                if(affectedrows>=1){
                    resolve(employee);
                }else{
                    throw new Error("Employee Not Found");
                }
            }).catch(function(error){
                reject(error);
            });
        });
    },
    'delete':function(id){
        return new Promise(function(resolve,reject) {
            models.Employee.destroy({
                where:{id:id}
            }).then(function(employee){
                resolve(employee);
            }).catch(function(error){
                reject(error);
            });
        });
    },
    'destory':function(employee){
        return new Promise(function(resolve,reject) {
            employee.destroy().then(function(employee){
                resolve(employee);
            }).catch(function(error){
                reject(error);
            });
        });
    },
    'getAddressBookByEmployeeId':function(id){
        return new Promise(function(resolve,reject){
            models.Employee.findAll({include:{
                model:models.EmployeeAddressBook
            },attributes:["id","name"],
                where:{
                    id:[
                        id
                    ]
                }
            }).then(function(employee){
                if(employee.length<=0){
                    throw new Error("employee address not found");
                }else{
                    resolve(employee);
                }
            }).catch(function(error){
                reject(error);
            });
        });
    },
    'getEmployeeAddressBookById':function(employeeid,id){
        return new Promise(function(resolve,reject){
            models.EmployeeAddressBook.findOne({
                where:{
                    EmployeeId: employeeid,
                    id:id
                }
            }).then(function(address){
                if(address.length<=0){
                    throw new Error("no employee address found");
                }else{
                    resolve(address);
                }
            }).catch(function(error){
                reject(error);
            });
        });
    },
    'addAddressBook':function(employee,options){
        return new Promise(function(resolve,reject) {
        options['isprimary']=(options['isprimary']==undefined)?0:options['isprimary'];
        options['isdeleted']=(options['isdeleted']==undefined)?0:options['isdeleted'];
            employee.createEmployeeAddressBook(options).then(function(v){
                resolve(v);
            }).catch(function(error){
                reject(error);
            });
        });
    },
    'deleteEmployeeAddressBookById':function(address){
        return new Promise(function(resolve,reject) {
            models.EmployeeAddressBook.destroy({where:{EmployeeId: employeeid,id:id}}).then(function(v){
                resolve(v);
            }).catch(function(error){
                resolve(error);
            });
        });
    },    
    'deleteEmployeeAddressBook':function(address){
        return new Promise(function(resolve,reject) {
            address.destroy().then(function(v){
                resolve(v);
            }).catch(function(error){
                resolve(error);
            });
        });
    },
    'updateEmployeeAddressBook':function(employeeid,id,values){
        return new Promise(function(resolve,reject) {
            models.EmployeeAddressBook.update(values,{where:{EmployeeId: employeeid,id:id}}).then(function(affectedrows){
                if(affectedrows<=0){
                    throw new Error("Employee Address Not Found");
                }else{
                    resolve(affectedrows);
                }
            }).catch(function(error){
                reject(error);
            });
        });
    }
}

module.exports = Employee;
