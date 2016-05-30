'use strict';

var express = require('express');
var path = require('path');

/** routers & controllers **/
var requestparameters=require('../bin/requestparameters.js');
var user=require('../controllers/user.js');
var order=require('../controllers/order.js');
var vendor=require('../controllers/vendor.js');
var dateutil = require('../bin/date.js');
var router = express.Router();

/* Login API */

router
.get('/api/login/',function(req, res, next) {
  user.login(requestparameters.getBasicAuthDetais(req)).then(function(result){
    res.json({rc:0,message:'welcome',data:{id: result.id, authkey:result.authkey}});
  }).catch(function(err){
    res.json({rc:-1,message:'invalid user details'});
  });
})
.post('/api/login/',function(req, res, next) {
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
    res.json({rc:0,message:'welcome',data:{id: result.id, authkey:result.authkey}});
  }).catch(function(err){
    res.json({rc:-1,message:'invalid user details'});
  });
})
.get('/api/vendors/',function(req,res,next){
    if(req.query.callback == undefined || req.query.token == undefined){
        res.status(404).send('Not found');    
    }else{
        res.set('Content-Type', 'application/x-javascript');
        res.set('Expires', '0');          
        user.auth({'authkey':req.query.token}).then(function(currentuser){
          vendor.getVendorsForAPI().then(function(vendors){
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
.get('/api/vendors/:id/',function(req,res,next){
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
.get('/api/orders/today', function(req, res, next) {
    if(req.query.callback == undefined || req.query.token == undefined){
        res.status(404).send('Not found');    
    }else{
        res.set('Content-Type', 'application/x-javascript');
        res.set('Expires', '0');          
        user.auth({'authkey':req.query.token}).then(function(currentuser){
          order.getToday({employeeid:currentuser.id}).then(function(orders){
                var buff = new Buffer(JSON.stringify({rc:0,orders:orders})).toString("base64");  
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
.get('/api/orders/status/pickup', function(req, res, next) {
    if(req.query.callback == undefined || req.query.token == undefined || req.query.from==undefined || req.query.to==undefined){
        res.status(404).send('Not found');    
    }else{
        res.set('Content-Type', 'application/x-javascript');
        res.set('Expires', '0');          
        user.auth({'authkey':req.query.token}).then(function(currentuser){
          order.getPickupStatus({employeeid:currentuser.id}).then(function(orders){
                var buff = new Buffer(JSON.stringify({rc:0,orders:orders})).toString("base64");  
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
.get('/api/orders/', function(req, res, next) {
    if(req.query.callback == undefined || req.query.token == undefined || req.query.from==undefined || req.query.to==undefined){
        res.status(404).send('Not found');    
    }else{
        res.set('Content-Type', 'application/x-javascript');
        res.set('Expires', '0');          
        user.auth({'authkey':req.query.token}).then(function(currentuser){
          order.getForAPI({from:req.query.from,to:req.query.to, employeeid:currentuser.id}).then(function(orders){
                var buff = new Buffer(JSON.stringify({rc:0,orders:orders})).toString("base64");  
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
          order.getById({id:req.params.id}).then(function(orders){
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
.get('/api/orders/:id/status', function(req, res, next) {
    
    if(req.query.callback == undefined || req.query.token == undefined){
        res.status(404).send('Not found');    
    }else{
        res.set('Content-Type', 'application/x-javascript');
        res.set('Expires', '0');          
        user.auth({'authkey':req.query.token}).then(function(currentuser){
          order.getById({id:req.params.id}).then(function(orders){
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
.get('/api/orders/:orderid/requestpickup', function(req, res, next) {   
  if(req.query.callback == undefined || req.query.token == undefined){
        res.status(404).send('Not found');      
  }else{
    res.set('Content-Type', 'application/x-javascript');
    res.set('Expires', '0');       
    user.auth({'authkey':req.query.token}).then(function(currentuser){
        order.setOrderToPickup(req.params.orderid,currentuser.id).then(function(affectedrows){
            
            if(affectedrows>0){
                var buff = new Buffer(JSON.stringify({rc:0,data:{orderid: req.params.orderid, employeeid: currentuser.id},message:'pickup accepted'})).toString("base64");  
                res.send(req.query.callback+'("'+buff+'")'); 
            }else{
                var buff = new Buffer(JSON.stringify({rc:-2,data:{orderid: req.params.orderid, employeeid: currentuser.id},message:'this order not accepting pickups'})).toString("base64");  
                res.send(req.query.callback+'("'+buff+'")');                 
            }
           
        });
    }).catch(function(err){
        console.log(err);
        res.json({rc:-1,message:'invalid user details'});
    });
  }      
})
.post('/api/orders/:orderid/sign/:id/pickup/', function(req, res, next) {
  var params=requestparameters.getPostParameters(req);
  if(params['token'] == undefined || params['vendorsign']==undefined || params['empsign']==undefined){
      res.json({rc:-1,message:'invalid details posted'});
  }else{
    user.auth({'authkey':params['token']}).then(function(currentuser){
        order.addPickupsignature(req.params.orderid,req.params.id,currentuser.id,
                params['vendorsign'],
                params['empsign']
        ).then(function(a){
            res.json({rc:0,message:'received succesfully'});
        });
        
        
    }).catch(function(err){
        console.log(err);
        res.json({rc:-1,message:'invalid user details'});
    });
  }      
})
.post('/api/orders/:orderid/sign/:id/delivery/', function(req, res, next) {
  var params=requestparameters.getPostParameters(req);
  if(params['token'] == undefined || params['customersign']==undefined || params['empsign']==undefined){
      res.json({rc:-1,message:'invalid details posted'});
  }else{
    user.auth({'authkey':params['token']}).then(function(currentuser){
        order.addDeliverysignature(req.params.orderid,req.params.id,currentuser.id,
                params['customersign'],
                params['empsign']
        ).then(function(a){
            res.json({rc:0,message:'received succesfully'});
        });
        
        
    }).catch(function(err){
        console.log(err);
        res.json({rc:-1,message:'invalid user details'});
    });
  }      
})

;


module.exports = router;
