/**
 * Created by talapaku on 12/7/2015.
 */

'use strict';

var express = require('express');
var path = require('path');


/** routers & controllers **/
var product=require('../controllers/product.js');
var productrouter = express.Router();
productrouter.get('/products/',function(req,res,next){
    product.get().then(function(products){
        res.json({rc:0,data:products});
    });
}).post('/product/',function(req,res,next){
    product.create({
      name:req.body['entity[name]'],
      type:req.body['entity[type]'],
      model:req.body['entity[model]'],
      serialnumber:req.body['entity[serialnumber]'],
      category:req.body['entity[category]'],
      subcategory:req.body['entity[subcategory]'],
      status:req.body['entity[status]']
    }).then(function(_newproduct){
                res.json(_newproduct);
    }).catch(function(err){
      product.destroy(newproduct).then(function(err){
        res.json({rc:-1,message:'few product details are not provided',details:err});
      }).catch(function(err){
        res.json({rc:-1,message:'few product details are not provided',details:err});
      });
    });
}).get('/product/:id/',function(req,res,next){
  product.getById(req.params.id).then(function(products){
    res.json({rc:0,data:products});
  }).catch(function(err){
    res.json({rc:-1,message:'no product found'});
  });
}).delete('/product/:id',function(req,res,next){
  product.delete(req.params.id).then(function(product){
    res.json({rc:0,data:product});
  });
}).put('/product/:id',function(req,res,next){
  product.update(req.params.id,{
    name:req.body['entity[name]'],
    type:req.body['entity[type]'],
    model:req.body['entity[model]'],
    serialnumber:req.body['entity[serialnumber]'],
    category:req.body['entity[category]'],
    subcategory:req.body['entity[subcategory]'],
    status:req.body['entity[status]']
  }).then(function(result){
    res.json({rc:0,message:'product details are updated',details:result});
  }).catch(function(err){
    console.log(err);
    res.json({rc:-1,message:'error occurred while updating product',details:err.message});
  });
}).get('/product/:id/parts/',function(req,res,next){
      product.getAddressBookByVendorId(req.params.id).then(function(products){
          res.json({rc:0,data:products});
      }).catch(function(err){
          res.json({rc:-1,message:'no part is provided'});
      });
}).post('/product/:id/part/',function(req,res,next){
      product.getById(req.params.id).then(function(_product){
          product
            .addPart(_product,{
                name:req.body['entity[name]'],
                type:req.body['entity[type]'],
                model:req.body['entity[model]'],
                serialnumber:req.body['entity[serialnumber]'],
                category:req.body['entity[category]'],
                subcategory:req.body['entity[subcategory]'],
                status:req.body['entity[status]']
            })
            .then(function(_product){
                res.json(_product);
            })
            .catch(function(err){
                res.json({rc:-1,message:'few part details are not provided',details:err}.message);
            });
      }).catch(function(err){
          res.json({rc:-1,message:'few part details are not provided',details:err.message});
      });
}).put('/product/:productid/part/:id',function(req,res,next){
    product.updatePart(req.params.productid,req.params.id,{
      name:req.body['entity[name]'],
      type:req.body['entity[type]'],
      model:req.body['entity[model]'],
      serialnumber:req.body['entity[serialnumber]'],
      category:req.body['entity[category]'],
      subcategory:req.body['entity[subcategory]'],
      status:req.body['entity[status]']
    }).then(function(result){
      res.json({rc:0,message:'given product part is updated'});
    }).catch(function(error){
      res.json({rc:-1,message:'error occurred while updating product part',details:error.message});
    });
}).delete('/product/:productid/part/:id',function(req,res,next){
    product.deletePart(req.params.productid,req.params.id).then(function(callback){
      res.json({rc:0,message:'given product part is deleted'});
    }).catch(function(error){
      res.json({rc:-1,message:'error occurred while removing product part',details:error});
    });
})


;
module.exports = productrouter;