'use strict';

var express = require('express');
var path = require('path');

/** routers & controllers **/
var requestparameters=require('../bin/requestparameters.js');
var user=require('../controllers/user.js');
var order=require('../controllers/order.js');
var vendor=require('../controllers/vendor.js');
var product=require('../controllers/product.js');
var customer=require('../controllers/customer.js');
var router = express.Router();
var bodyParser = require('body-parser');

/* Login API */


router
.get('/api/login/',function(req, res, next) {
  user.login(requestparameters.getBasicAuthDetais(req)).then(function(result){
    res.json({rc:0,message:'welcome',data:{authkey:result.authkey}});
  }).catch(function(err){
    res.json({rc:-1,message:'invalid user details'});
  });
})
.get('/store/api/vendors/',function(req,res,next){
    vendor.getVendorsForAPI().then(function(vendors){
        res.json({rc:0,vendors:vendors});
    }).catch(function(err){
        res.json({rc:-1,message:'invalid details requested',vendors:{}});
    });
})
.get('/store/api/vendors/:id/products',function(req,res,next){
    product.getByVendorForAPI(req.params.id).then(function(products){
      res.json({rc:0,products:products});
    }).catch(function(err){
      res.json({rc:-1,message:err.message,products:{}});
    });
})
.get('/customer/api/vendors/:id/',function(req,res,next){
    if(req.query.callback == undefined || req.query.token == undefined){
        res.status(404).send('Not found');    
    }else{
        res.set('Content-Type', 'application/x-javascript');
        res.set('Expires', '0');          
        user.auth({'authkey':req.query.token}).then(function(currentuser){
          vendor.getByIdForAPI(req.params.id).then(function(vendors){
                var buff = new Buffer(JSON.stringify({rc:0,data:vendors})).toString("base64");  
                res.send(req.query.callback+'("'+buff+'")');
            }).catch(function(err){
                var buff = new Buffer(JSON.stringify({rc:-1,message:'invalid details requested'})).toString("base64");  
                res.send(req.query.callback+'("'+buff+'")');
            });
        }).catch(function(err){
            console.log(err);
            var buff = new Buffer(JSON.stringify({rc:-1,message:'invalid user details'})).toString("base64");  
            res.send(req.query.callback+'("'+buff+'")');
        })          

    }
})
.get('/customer/api/orders/',function(req,res,next){
})
.get('/store/api/customer/:customerid/orders/:id',function(req,res,next){
  order.getById({id:req.params.id}).then(function(orders){
        //var buff = new Buffer(JSON.stringify({rc:0,data:orders})).toString("base64");  
        //res.send(req.query.callback+'("'+buff+'")');
        res.json({rc:0,orders:orders});
    }).catch(function(err){
        //var buff = new Buffer(JSON.stringify({rc:-1,message:'invalid details requested'})).toString("base64");  
        //res.send(req.query.callback+'("'+buff+'")');
      res.json({rc:0,orders:[],error:err});
    });
})
.post('/store/api/orders/',function(req,res,next){
    
    var _reqp=requestparameters.getPostParameters(req);
    
    var _json=new Buffer(_reqp['json'], 'base64').toString('ascii');
    var _params=JSON.parse(_json);
    var _address=_params.customer.deliveryAddress;
    _address['email']=_params.customer.email;
    
    customer.create({
        name:_params.customer.name,
    }).then(function(_newcustomer){
        customer
            .addContact(_newcustomer,{
                        name:_params.customer.name,
                        isprimary:1,
                        isdeleted:0
            }).then(function(_contact){
            customer
                .addContactAddressBook(_contact,_address)
                .then(function(_newcustomeraddress){
                    var _orderparams={
                        CustomerId:_newcustomer.id,
                        name:_newcustomer.name.substr(0,_newcustomer.name.indexOf(','))+"-"+order.generate(5),
                        EmployeeId:0,
                        CustomerDeliveryAddressBookId:_newcustomeraddress.id,
                        CustomerBillingAddressBookId:_newcustomeraddress.id,
                        scheduleAt:_params.customer.scheduledate+" "+_params.customer.scheduletime,
                        deliveryAt:'9999-12-31',
                        status:'new',
                        isdeleted:0,
                        EmployeeSignatureImageId:0,
                        CustomerSignatureImageId:0,
                        VendorContactAddressBookId:0,
                        items:_params.items
                    };
                    order.create(_orderparams).then(function(_neworder){
                        res.json({rc:0,message:'order placed succesfully',customer:_newcustomer.id,order:_neworder.id});
                    });
                })
                .catch(function(err){
                
                    customer.destroy(_newcustomer).then(function(err){
                        res.json({rc:-1,message:'address details are not provided',order:[]});
                    }).catch(function(err){
                        res.json({rc:-1,message:'address details are not provided',order:[]});
                    });
                });
            
            }).catch(function(err){
            
                    customer.destroy(_newcustomer).then(function(err){
                        res.json({rc:-1,message:'address details are not provided',order:[]});
                    }).catch(function(err){
                        res.json({rc:-1,message:'address details are not provided',order:[]});
                    });
            });
        
    }).catch(function(err){
        res.json({rc:-1,message:'address details are not provided',order:[]});
    });    
})
.get('/app/api/orders/', function(req, res, next) {
    if(req.query.callback == undefined || req.query.token == undefined || req.query.from==undefined || req.query.to==undefined){
        res.status(404).send('Not found');    
    }else{
        res.set('Content-Type', 'application/x-javascript');
        res.set('Expires', '0');          
        user.auth({'authkey':req.query.token}).then(function(currentuser){
          order.get({from:req.query.from,to:req.query.to}).then(function(orders){
                var buff = new Buffer(JSON.stringify({rc:0,data:orders})).toString("base64");  
                res.send(req.query.callback+'("'+buff+'")');
            }).catch(function(err){
                var buff = new Buffer(JSON.stringify({rc:-1,message:'invalid details requested'})).toString("base64");  
                res.send(req.query.callback+'("'+buff+'")');
            });
        }).catch(function(err){
            var buff = new Buffer(JSON.stringify({rc:-1,message:'invalid user details'})).toString("base64");  
            res.send(req.query.callback+'("'+buff+'")');
        })          

    }    
})
.get('/api/orders/:id/', function(req, res, next) {
    if(req.query.callback == undefined || req.query.token == undefined){
        res.status(404).send('Not found');    
    }else{
        res.set('Content-Type', 'application/x-javascript');
        res.set('Expires', '0');          
        user.auth({'authkey':req.query.token}).then(function(currentuser){
          order.get({id:req.params.id}).then(function(orders){
                var buff = new Buffer(JSON.stringify({rc:0,data:orders})).toString("base64");  
                res.send(req.query.callback+'("'+buff+'")');
            }).catch(function(err){
                var buff = new Buffer(JSON.stringify({rc:-1,message:'invalid details requested'})).toString("base64");  
                res.send(req.query.callback+'("'+buff+'")');
            });
        }).catch(function(err){
            var buff = new Buffer(JSON.stringify({rc:-1,message:'invalid user details'})).toString("base64");  
            res.send(req.query.callback+'("'+buff+'")');
        })          

    }    
})
.post('/api/orders/:orderid/vendor/:id/pickup/',function(req, res, next) {
  params=requestparameters.getPostParameters(req);
  if(params['token']==undefined || params['vendorsign']==undefined || params['empsign']==undefined){
      res.json({rc:-1,message:'invalid details posted'});
  }else{
    user.auth({'authkey':req.query.token}).then(function(currentuser){
        res.json({rc:0,message:'received succesfully'});
    }).catch(function(err){
        res.json({rc:-1,message:'invalid user details'});
    });
  }      
})
.post('/api/orders/:orderid/delivery/', function(req, res, next) {
  params=requestparameters.getPostParameters(req);
  if(params['token']==undefined || params['customersign']==undefined || params['empsign']==undefined){
      res.json({rc:-1,message:'invalid details posted'});
  }else{
    user.auth({'authkey':req.query.token}).then(function(currentuser){
        res.json({rc:0,message:'received succesfully'});
    }).catch(function(err){
        res.json({rc:-1,message:'invalid user details'});
    });
  }      
})
;


module.exports = router;
