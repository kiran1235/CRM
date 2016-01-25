/**
 * Created by talapaku on 12/7/2015.
 */

'use strict';

var express = require('express');
var path = require('path');
var multer = require('multer');

/** routers & controllers **/
var requestparameters=require('../bin/requestparameters.js');
var product=require('../controllers/product.js');
var inventory=require('../controllers/inventory.js');
var productrouter = express.Router();

var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, './tmp/uploads/');
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
  }
});







productrouter
.get('/products/',function(req,res,next){
  product.get().then(function(products){
    res.json({rc:0,data:products});
  });
})
//.get('/product/:vendorid',function(req,res,next){
//    product.getByVendor(req.params.vendorid).then(function(products){
//      res.json({rc:0,data:products});
//    });
//}).post('/product/:vendorid',function(req,res,next){
//  var self= this;
//  product.create(
//    requestparameters.getPostParameters(req)
//  ).then(function(_newproduct){
//    res.json({rc:0,data:_newproduct});
//  }).catch(function(err){
//      res.json({rc:-1,message:'few product details are not provided',details:err});
//  });
//})
.get('/product/:id/',function(req,res,next){
  product.getById(req.params.id).then(function(products){
    res.json({rc:0,data:products});
  }).catch(function(err){
    res.json({rc:-1,message:'no product found',error:err.message});
  });
}).delete('/product/:id',function(req,res,next){
  product.delete(req.params.id).then(function(product){
    res.json({rc:0,data:product});
  });
}).put('/product/:id',function(req,res,next){
  product.update(req.params.id,requestparameters.getPostParameters(req)).then(function(result){
    result=requestparameters.getPostParameters(req);
    result['updatedAt']=new Date().toISOString();
      res.json({rc:0,data:result,message:'product details are updated'});
  }).catch(function(err){
    console.log(err);
    res.json({rc:-1,message:'error occurred while updating product',details:err.message});
  });
})


//  .get('/product/:id/parts/',function(req,res,next){
//      product.getProductPartsByProductId(req.params.id).then(function(products){
//          res.json({rc:0,data:products});
//      }).catch(function(err){
//          res.json({rc:-1,message:'error ocurred while fetching product parts',details:err.message});
//      });
//}).post('/product/:id/part/',function(req,res,next){
//      product.getById(req.params.id).then(function(_product){
//          product
//            .addPart(_product,{
//                name:req.body['entity[name]'],
//                type:req.body['entity[type]'],
//                model:req.body['entity[model]'],
//                serialnumber:req.body['entity[serialnumber]'],
//                category:req.body['entity[category]'],
//                subcategory:req.body['entity[subcategory]'],
//                status:req.body['entity[status]']
//            })
//            .then(function(_product){
//                res.json(_product);
//            })
//            .catch(function(err){
//                res.json({rc:-1,message:'few part details are not provided',details:err}.message);
//            });
//      }).catch(function(err){
//          res.json({rc:-1,message:'few part details are not provided',details:err.message});
//      });
//}).put('/product/:productid/part/:id',function(req,res,next){
//    product.updatePart(req.params.productid,req.params.id,{
//      name:req.body['entity[name]'],
//      type:req.body['entity[type]'],
//      model:req.body['entity[model]'],
//      serialnumber:req.body['entity[serialnumber]'],
//      category:req.body['entity[category]'],
//      subcategory:req.body['entity[subcategory]'],
//      status:req.body['entity[status]']
//    }).then(function(result){
//      res.json({rc:0,message:'given product part is updated'});
//    }).catch(function(error){
//      res.json({rc:-1,message:'error occurred while updating product part',details:error.message});
//    });
//}).delete('/product/:productid/part/:id',function(req,res,next){
//    product.deletePart(req.params.productid,req.params.id).then(function(callback){
//      res.json({rc:0,message:'given product part is deleted'});
//    }).catch(function(error){
//      res.json({rc:-1,message:'error occurred while removing product part',details:error});
//    });
//})
//

.get('/inventory/',function(req,res,next){
  inventory.get().then(function(inventory){
    res.json({rc:0,data:inventory});
  });
}).get('/product/:id/inventory/',function(req,res,next){
    var self=this;
    inventory.getByProduct(req.params.id,
      requestparameters.getPostParameters(req)
    ).then(function(_new){
      res.json({rc:0,data:_new});
    }).catch(function(err){
      console.log(err);
      res.json({rc:-1,message:'few Inventory details are not provided',details:err});
    });
}).post('/product/:id/inventory/',function(req,res,next){
  var self=this;
  product.getById(req.params.id).then(function(product){
    inventory.create(product,
      requestparameters.getPostParameters(req)
    ).then(function(_new){
      res.json({rc:0,data:_new});
    }).catch(function(err){
      console.log(err);
      res.json({rc:-1,message:'few Inventory details are not provided',details:err});
    });
  }).catch(function(err){
    res.json({rc:-1,message:'no product found'});
  });

}).put('/product/:productid/inventory/:id',function(req,res,next){
  var self= this;
    inventory.update(req.params.productid,req.params.id,
      requestparameters.getPostParameters(req)
    ).then(function(affectedRows){
      res.json({rc:0,message:"Inventory updated",data:requestparameters.getPostParameters(req)});
    }).catch(function(err){
      console.log(err);
      res.json({rc:-1,message:'few Inventory details are not provided',details:err});
    });
})
.get('/vendor/:vendorid/inventory/',function(req,res,next){
    product.getByVendor(req.params.vendorid).then(function(products){
      res.json({rc:0,data:products});
    });
})
.post('/product/:id/upload/',function(req,res,next){
  var upload = multer({ //multer settings
    storage: storage
  }).single('file');


  upload(req,res,function(err){
    if(err){
      res.json({rc:-1,message:"error occured while upoading"});
      return;
    }
    res.json({rc:0,message:"Success",location:"/"+req.file.path});
  });
})

;
module.exports = productrouter;