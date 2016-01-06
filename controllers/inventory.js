'use strict';

var Promise = require("bluebird");

/** load models **/
var models = require('../models/index.js');


var Inventory = {
  'create':function(product,options){
    return new Promise(function(resolve,reject) {
      delete options['id'];
      product.createInventory(options).then(function (inventory) {
        resolve(inventory);
      }).catch(function(error){
        reject(error);
      });
    });
  },
  'update':function(productid,id,options){
    return new Promise(function(resolve,reject) {
      delete options['inventoryId'];
      delete options['id'];
      delete options['createdAt'];
      delete options['updatedAt'];

      models.Inventory
        .update(options,{where:{id:id,ProductId:productid}})
        .then(function(affectedrows){
            if(affectedrows>=1){
              resolve(affectedrows);
            }else {
              throw new Error("Unable to update Inventory with given details");
            }
          })
        .catch(function(error){
          reject(error);
        });
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
            attributes:["id","unitprice","instock","instock","restock","serialnumber"]
          },
        ],
        attributes:["id","name"]
      }).then(function (inventory) {
        resolve(inventory);
      }).catch(function (error) {
        reject(error);
      });
    });
  },
  'getByProduct':function(productid,options){
    return new Promise(function(resolve,reject) {
      models.Product.findAll({
        include:[
          {
            model: models.Inventory,
            attributes:["id","unitprice","instock","instock","restock","serialnumber"]
          },
        ],
        attributes:["id","name"],
        where:{id:productid}
      }).then(function (inventory) {
        resolve(inventory);
      }).catch(function (error) {
        reject(error);
      });
    });
  },
}

module.exports = Inventory;
