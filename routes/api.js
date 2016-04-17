'use strict';

var express = require('express');
var path = require('path');

/** routers & controllers **/
var requestparameters=require('../bin/requestparameters.js');
var user=require('../controllers/user.js');
var order=require('../controllers/order.js');
var vendor=require('../controllers/vendor.js');
var router = express.Router();

/* Login API */

/*
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
 	 user.login({
		 'email':username,
		 'password':password
	  }).then(function(result){
		    return done(null,false,{rc:0,message:'welcome',data:{authkey:result.authkey}});
	  }).catch(function(err){
		    return done(null,false,{rc:-1,message:'invalid user details'});
	  });
	}
));
router
.post('/api/login/',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/api/login',
                                   failureFlash: true })
)

*/




router
.get('/api/login/',function(req, res, next) {
  user.login(requestparameters.getBasicAuthDetais(req)).then(function(result){
    res.json({rc:0,message:'welcome',data:{authkey:result.authkey}});
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
.get('/api/orders/', function(req, res, next) {
    if(req.query.callback == undefined || req.query.token == undefined || req.query.from==undefined || req.query.to==undefined){
        res.status(404).send('Not found');    
    }else{
        res.set('Content-Type', 'application/x-javascript');
        res.set('Expires', '0');          
        user.auth({'authkey':req.query.token}).then(function(currentuser){
          order.get({from:req.query.from,to:req.query.to}).then(function(orders){
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
.post('/api/orders/:orderid/sign/:id/pickup/', function(req, res, next) {
  var params=requestparameters.getPostParameters(req);
  
    
  if(req.query.token == undefined || params['vendorsign']==undefined || params['empsign']==undefined){
      res.json({rc:-1,message:'invalid details posted'});
  }else{
    user.auth({'authkey':req.query.token}).then(function(currentuser){
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
  
    
  if(req.query.token == undefined || params['customersign']==undefined || params['empsign']==undefined){
      res.json({rc:-1,message:'invalid details posted'});
  }else{
    user.auth({'authkey':req.query.token}).then(function(currentuser){
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
