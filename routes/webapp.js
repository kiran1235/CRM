/**
 * Created by talapaku on 12/7/2015.
 */

'use strict';

var express = require('express');
var path = require('path');
var url = require('url');
var requestparameters=require('../bin/requestparameters.js');

var dateutil = require('../bin/date.js');
var multer = require('multer');
var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, './tmp/uploads/');
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
  }
});

/** routers & controllers **/
var user=require('../controllers/user.js');
var employee=require('../controllers/employee.js');
var customer=require('../controllers/customer.js');
var vendor=require('../controllers/vendor.js');
var order=require('../controllers/order.js');
var product=require('../controllers/product.js');
var inventory=require('../controllers/inventory.js');

var webapprouter = express.Router();

webapprouter
.get('/webapp/login/',function(req, res, next) {
  user.login(requestparameters.getBasicAuthDetais(req)).then(function(result){
    res.json({rc:0,message:'welcome',data:{id: result.id, authkey:result.authkey,type:result.parentType}});
  }).catch(function(err){
    res.json({rc:-1,message:'invalid user details'});
  });
})
.post('/webapp/login/',function(req, res, next) {
  var params=requestparameters.getPostParameters(req);
  if(params['email']==undefined && params['username'] == undefined){
  	 res.json({rc:-1,message:'invalid user details'});
      return;
  }else if(params['username']){
  	 params['email']=params['username']
  }    
  if(params['hashkey']==undefined && params['password'] == undefined){
  	 res.json({rc:-1,message:'invalid user details'});
      return;
  }else if(params['password']){
  	 params['hashkey']=params['password']
  }
  user.login(params).then(function(result){
    res.json({rc:0,message:'welcome',data:{id: result.id, authkey:result.authkey,type:result.parentType}});
  }).catch(function(err){
    console.log(err);  
    res.json({rc:-1,message:'invalid user details x'});
  });
})
.all('/webapp/users/*',function(req,res,next){
    user.auth({'authkey':req.headers['x-session-token']}).then(function(currentuser){
        req.currentuser=currentuser;
        next();
    }).catch(function(){
        res.status(404).send('invalid user details');
    });
})
.all('/webapp/orders/*',function(req,res,next){
    user.auth({'authkey':req.headers['x-session-token']}).then(function(currentuser){
        req.currentuser=currentuser;
        next();
    }).catch(function(){
        res.status(404).send('invalid user details');
    });
})
.all('/webapp/products/*',function(req,res,next){
    user.auth({'authkey':req.headers['x-session-token']}).then(function(currentuser){
        req.currentuser=currentuser;
        if(req.currentuser.parentType=='Employee'){
            res.status(404).send('invalid request');
        }else{
            next();
        }        
    }).catch(function(){
        res.status(404).send('invalid user details');
    });
})
.get('/webapp/user/:id/',function(req,res,next){
    user.get({authkey:req.query.token}).then(function(user){
        if(user.Employee){
            res.json({rc:0,data:user,menuoptions:[{title:"orders",icon:"shopping_cart"}]});            
        }else if(user.Vendor){
            res.json({rc:0,data:user,menuoptions:[{title:"products",icon:"store_mall_directory"},{title:"orders",icon:"shopping_cart"}]});
        }else if(user.parentType=='admin'){
            res.json({rc:0,data:user,menuoptions:[{title:"customers",icon:"person"},{title:"employees",icon:"local_shipping"},{title:"vendors",icon:"business"},{title:"products",icon:"store_mall_directory"},{title:"orders",icon:"shopping_cart"}]});
        }else{
            res.status(404).send('invalid user details');
        }
    }).catch(function(error){
       res.json({rc:-1,message:'invalid user details'});
    });

})
.get('/webapp/orders/',function(req,res,next){
  var _now=dateutil.now();
  var _from=dateutil.getFormatDate(_now);  
  var _to=dateutil.getFormatDate(dateutil.addDays(_now,15));
  
  if(req.currentuser.parentType=='Employee'){
        order.getByEmployeeID({
            from: '01/01/2015',
            to:_to,
            id:req.currentuser.parentId
        }).then(function(orders){
          res.json({rc:0,data:orders});
        });
    }else if(req.currentuser.parentType=='Vendor'){
        order.getByVendorId({
            from: '01/01/2015',
            to:_to,
            id:req.currentuser.parentId
        }).then(function(orders){
          res.json({rc:0,data:orders});
        });        
    }else if(req.currentuser.parentType=='admin'){
        order.get({
            from: '01/01/2015',
            to:_to
        }).then(function(orders){
          res.json({rc:0,data:orders});
        });        
    }else{
        res.status(404).send('invalid request');
    }
})
.get('/webapp/orders/:id',function(req,res,next){
//  order.getById({id:req.params.id}).then(function(order){
//    res.json({rc:0,data:order});
//  });
  if(req.currentuser.parentType=='Employee'){
        order.getById({id:req.params.id,EmployeeId:req.currentuser.parentId}).then(function(order){
          res.json({rc:0,data:order});
        });
    }else if(req.currentuser.parentType=='Vendor'){
        order.getById({id:req.params.id,VendorId:req.currentuser.parentId}).then(function(order){
          res.json({rc:0,data:order});
        });
    }else if(req.currentuser.parentType=='admin'){
        order.getById({
            id:req.params.id
        }).then(function(orders){
          res.json({rc:0,data:orders});
        });        
    }else{
        res.status(404).send('invalid request');
    }
})
.put('/webapp/orders/:id/confirm',function(req,res,next){
  
  if(req.currentuser.parentType=='Vendor'){
        order.confirmOrderFromVendor({
            OrderId:req.params.id,
            VendorId:req.currentuser.parentId
        }).then(function(affectedrows){
          res.json({rc:0,data:"confirmed"});
        });
    }else{
        res.status(404).send('invalid request');
    }
})
.get('/webapp/orders/vendors/:id',function(req,res,next){
  order.getByVendorId({id:req.params.id}).then(function(orders){
    res.json({rc:0,data:orders});
  });
})
.get('/webapp/orders/customers/:id',function(req,res,next){
  order.getByCustomerId({customerid:req.params.id}).then(function(orders){
    res.json({rc:0,data:orders});
  });
})
.get('/webapp/orders/employees/:id',function(req,res,next){
  var _now=dateutil.now();
  var _from=dateutil.getFormatDate(_now);  
  var _to=dateutil.getFormatDate(dateutil.addDays(_now,15));
    
        order.getByEmployeeID({
            from: '01/01/2015',
            to:_to,
            id:req.params.id
        }).then(function(orders){
          res.json({rc:0,data:orders});
        });
})
.get('/webapp/products/',function(req,res,next){
    if(req.currentuser.parentType=='Vendor'){
        product.getByVendor(req.currentuser.parentId).then(function(products){
          res.json({rc:0,data:products});
        }).catch(function(err){
          console.log(err);  
          res.json({rc:-1,message:err.message,data:{}});
        });
    }else if(req.currentuser.parentType=='admin'){
        product.get().then(function(products){
          res.json({rc:0,data:products});
        }).catch(function(err){
          console.log(err);  
          res.json({rc:-1,message:err.message,data:{}});
        });
    }else{
        res.status(404).send('invalid request');
    }
})
.get('/webapp/products/:id/',function(req,res,next){
  product.getById(req.params.id).then(function(products){
    res.json({rc:0,data:products});
  }).catch(function(err){
    res.json({rc:-1,message:'no product found',error:err.message});
  });
}).delete('/webapp/products/:id',function(req,res,next){
  product.delete(req.params.id).then(function(product){
    res.json({rc:0,data:product});
  });
}).put('/webapp/products/:id',function(req,res,next){
  product.update(req.params.id,requestparameters.getPostParameters(req)).then(function(result){
    result=requestparameters.getPostParameters(req);
    result['updatedAt']=new Date().toISOString();
      res.json({rc:0,data:result,message:'product details are updated'});
  }).catch(function(err){
    console.log(err);
    res.json({rc:-1,message:'error occurred while updating product',details:err.message});
  });
})
.post('/webapp/products/',function(req,res,next){
    vendor.addProduct(req.currentuser.parentId,
        requestparameters.getPostParameters(req)
    ).then(function(_newproduct){
        res.json({rc:0,data:_newproduct});
    }).catch(function(err){
      res.json({rc:-1,message:'few product details are not provided',details:err});
    });
})
.post('/webapp/products/:id/upload/',function(req,res,next){
  var upload = multer({ 
    storage: storage
  }).single('file');
  upload(req,res,function(err){
    if(err){
      res.json({rc:-1,message:"error occured while upoading"});
      return;
    }
    product.uploadImage(req.params.id,req.file).then(function(image){
      res.json({rc:0,message:"Success",location:"/tmp/uploads/"+image.filename});
    }).catch(function(err){
      res.json({rc:-1,message:'Unable to add image to the given product',details:err});
    });
  });
})
.get('/webapp/products/:id/inventory/',function(req,res,next){
    inventory.getByProduct(req.params.id,
      requestparameters.getPostParameters(req)
    ).then(function(_new){
      res.json({rc:0,data:_new});
    }).catch(function(err){
      console.log(err);
      res.json({rc:-1,message:'few Inventory details are not provided',details:err});
    });
})
.post('/webapp/products/:id/inventory/',function(req,res,next){
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

})
.put('/webapp/products/:productid/inventory/:id',function(req,res,next){
    inventory.update(req.params.productid,req.params.id,
      requestparameters.getPostParameters(req)
    ).then(function(affectedRows){
      res.json({rc:0,message:"Inventory updated"});
    }).catch(function(err){
      console.log(err);
      res.json({rc:-1,message:'few Inventory details are not provided',details:err});
    });
})
.get('/webapp/vendors/',function(req,res,next){
  vendor.get().then(function(vendors){
    res.json({rc:0,data:vendors});
  });
}).post('/webapp/vendors/',function(req,res,next){
    var newvendorid=0;
    var params=requestparameters.getPostParameters(req);
    params.isprimary=1;
    vendor.create({
        name:params.name
    }).then(function(_newvendor){
        newvendorid=_newvendor.id;
        vendor.addContact(_newvendor,{
          name:params.contactname,
          isprimary:1
        }).then(function(_newvendorcontact){
            vendor.addContactAddressBook(_newvendorcontact,params).then(function(_newvendorcontact){
              res.json({rc:0,message:'success vendor is addedd',VendorId:newvendorid});
            }).catch(function(err){
              vendor.destory(_newvendor).then(function(err) {
                res.json({rc: -1, message: "Please Enter Valid Address", details: err.message});
              });
            });
        }).catch(function(err){
          vendor.destory(_newvendorcontact).then(function(err){
            res.json({rc:-1,message:'Valid Contact Name is not provided',details:err.message});
          });
        })
    }).catch(function(err){
      res.json({rc:-1,message:'Valid Vendor Name is not provided',details:err.message});
    });
}).get('/webapp/vendors/:id/',function(req,res,next){
  vendor.getById(req.params.id).then(function(vendors){
    res.json({rc:0,data:vendors});
  }).catch(function(err){
    res.json({rc:-1,message:'no vendor found',details:err.message});
  });
}).delete('/webapp/vendors/:id',function(req,res,next){
  vendor.delete(req.params.id).then(function(vendor){
    res.json({rc:0,data:vendor});
  });
}).put('/webapp/vendors/:id',function(req,res,next){
  vendor.update(req.params.id,{name:req.body['entity[name]']}).then(function(result){
    res.json({rc:0,message:'vendor details are updated',details:result});
  }).catch(function(err){
    console.log(err);
    res.json({rc:-1,message:'error occurred while updating vendor',details:err.message});
  });
}).get('/webapp/employees/',function(req,res,next){
  employee.get().then(function(employees){
    res.json({rc:0,data:employees});
  });
}).get('/webapp/employees/:id',function(req,res,next){
  employee.getById(req.params.id).then(function(employee){
    res.json({rc:0,data:employee});
  });
}).get('/webapp/customers/',function(req,res,next){
  customer.get().then(function(customers){
    res.json({rc:0,data:customers});
  });
}).get('/webapp/customers/:id',function(req,res,next){
  customer.getById(req.params.id).then(function(customer){
    res.json({rc:0,data:customer});
  });
})

;
module.exports = webapprouter;