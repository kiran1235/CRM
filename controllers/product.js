'use strict';

var Promise = require("bluebird");

/** load models **/
var models = require('../models/index.js');


var Product = {
    'get':function(options){
       return new Promise(function(resolve,reject) {
           models.Product.findAll({
           }).then(function (products) {
               resolve(products);
           }).catch(function (error) {
               reject(error);
           });
       });
    },
    'getById':function(id){
        return new Promise(function(resolve,reject) {
            models.Product.findOne({
                where: {id: id}
            }).then(function (product) {
                if(product.length<=0){
                    throw new Error("Product Not Found");
                }else{
                    resolve(product);
                }
            }).catch(function (error) {
                reject(error);
            });
        });
    },
    'getByFilters':function(options){
        return new Promise(function(resolve,reject) {
            models.Product.findAll({
                where: options
            }).then(function (product) {
                if(product.length<=0){
                    throw new Error("Products Not Found");
                }else{
                    resolve(product);
                }
            }).catch(function (error) {
                reject(error);
            });
        });
    },
    'create':function(options){
        return new Promise(function(resolve,reject) {
            models.Product.create(options).then(function (product) {
                resolve(product);
            }).catch(function(error){
                reject(error);
            });
        });
    },
    'update':function(id,values){
        return new Promise(function(resolve,reject) {
            models.Product.update(values, {
                where:{id:id}
            }).then(function (affectedrows) {
                if(affectedrows>=1){
                    resolve(product);
                }else{
                    throw new Error("Product Not Found");
                }
            }).catch(function(error){
                reject(error);
            });
        });
    },
    'delete':function(id){
        return new Promise(function(resolve,reject) {
            models.Product.destroy({
                where:{id:id}
            }).then(function(product){
                resolve(product);
            }).catch(function(error){
                reject(error);
            });
        });
    },
    'destory':function(product){
        return product.destroy().then(function(product){
                resolve(product);
            }).catch(function(error){
                reject(error);
            });
    },
    'getProductPartsByProductId':function(id){
        return new Promise(function(resolve,reject){
            models.Part.findAll({include:{
              model:models.Product,
                where:{
                    id: id
                }
            }
            }).then(function(parts){
                if(parts.length<=0){
                    throw new Error("Product Part Not Found");
                }else{
                    resolve(parts);
                }
            }).catch(function(error){
                reject(error);
            });
        });
    },
    'getPartById':function(id){
        return new Promise(function(resolve,reject){
            models.Part.findOne({
                where:{
                    id:id
                }
            }).then(function(part){
                if(part.length<=0){
                    throw new Error("Part Not Found");
                }else{
                    resolve(part);
                }
            }).catch(function(error){
                reject(error);
            });
        });
    },
    //todo: this should create part record and product part record
    'addProductPart':function(product,options){
        return new Promise(function(resolve,reject) {
            product.createPart(options).then(function(v){
                resolve(v);
            }).catch(function(error){
                reject(error);
            });
        });
    },
    'deleteProductPart':function(address){
        return new Promise(function(resolve,reject) {
            address.destroy().then(function(v){
                resolve(v);
            }).catch(function(error){
                resolve(error);
            });
        });
    },
    'updateProductPart':function(productid,id,values){
        return new Promise(function(resolve,reject) {
            models.ProductPart.update(values,{where:{ProductId: productid,id:id}}).then(function(affectedrows){
                if(affectedrows<=0){
                    throw new Error("Product Part Not Found");
                }else{
                    resolve(affectedrows);
                }
            }).catch(function(error){
                reject(error);
            });
        });
    },
}

module.exports = Product;
