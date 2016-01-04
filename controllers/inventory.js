'use strict';

var Promise = require("bluebird");

/** load models **/
var models = require('../models/index.js');


var Inventory = {
  'create':function(product,options){
    return new Promise(function(resolve,reject) {
      product.createInventory(options).then(function (inventory) {
        resolve(inventory);
      }).catch(function(error){
        reject(error);
      });
    });
  },
  'update':function(product,options){
    return new Promise(function(resolve,reject) {
      //product.getInventories({})
      console.log(options);
      //product.inventories[0].updateAttributes(options).then(function (inventory) {
      //  resolve(inventory);
      //}).catch(function(error){
      //  console.log(error);
      //  reject(error);
      //});
    });
  },
  'delete':function(id){
    return new Promise(function(resolve,reject) {
      models.Inventory.destroy({
        where:{id:id}
      }).then(function(product){
        resolve(product);
      }).catch(function(error){
        reject(error);
      });
    });
  },
  'destory':function(inventory){
    return inventory.destroy().then(function(inventory){
      resolve(inventory);
    }).catch(function(error){
      reject(error);
    });
  },
  'get':function(options){
    return new Promise(function(resolve,reject) {
      models.Product.findAll({
        include:[
          {
            model: models.Inventory,
            attributes:["id","unitprice","instock","instock"]
          },
        ],
        attributes:["id","name","serialnumber"]
      }).then(function (inventory) {
        resolve(inventory);
      }).catch(function (error) {
        reject(error);
      });
    });
  },
}

module.exports = Inventory;
