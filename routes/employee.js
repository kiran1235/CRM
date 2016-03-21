/**
 * Created by talapaku on 12/7/2015.
 */

'use strict';

var express = require('express');
var path = require('path');
var requestparameters=require('../bin/requestparameters.js');

/** routers & controllers **/
var employee=require('../controllers/employee.js');
var employeerouter = express.Router();
employeerouter.get('/employees/',function(req,res,next){
  employee.get().then(function(employees){
    res.json({rc:0,data:employees});
  });
}).post('/employees/',function(req,res,next){
    var params=requestparameters.getPostParameters(req);
    params.isprimary=1;
    params.isdeleted=0;
    params.dol='9999-12-31';
    employee.create(params).then(function(_newemployee){
      employee.addAddressBook(_newemployee,params).then(function(_addressbook){
            res.json({rc:0,message:'success employee is addedd',employee:_newemployee});
        }).catch(function(err){
            _newemployee.destroy().then(function(){
                res.json({rc:-1,message:'few address details are not provided'});
            }).catch(function(){
                res.json({rc:-1,message:'Valid Employee Details is not provided'});
            });
        });        
    }).catch(function(err){
        res.json({rc:-1,message:'Valid Employee is not provided',details:err});
    });
}).get('/employees/:id/',function(req,res,next){
  employee.getById(req.params.id).then(function(employee){
    res.json({rc:0,data:employee});
  }).catch(function(err){
    res.json({rc:-1,message:'no employee found'});
  });
}).delete('/employees/:id',function(req,res,next){
  employee.delete(req.params.id).then(function(employee){
    res.json({rc:0,message:'employee deleted'});
  }).catch(function(err){
    res.json({rc:-1,message:'no employee found'});
  });;
}).put('/employees/:id',function(req,res,next){
  employee.update(req.params.id,{name:req.body['entity[name]']}).then(function(employee){
    res.json({rc:0,message:'employee details are updated',data:employee});
  }).catch(function(err){
    console.log(err);
    res.json({rc:-1,message:'error occurred while updating employee'});
  });
}).get('/employees/:id/address/',function(req,res,next){
      employee.getAddressBookByEmployeeId(req.params.id).then(function(addressbook){
          res.json({rc:0,data:addressbook});
      }).catch(function(err){
          res.json({rc:-1,message:'no address book is found'});
      });
}).post('/employees/:id/address/',function(req,res,next){
      employee.getById(req.params.id).then(function(_employee){
          var params=requestparameters.getPostParameters(req);
          params.isprimary=1;
          employee.addAddressBook(_employee,params).then(function(_addressbook){
                res.json(_addressbook);
            }).catch(function(err){
                res.json({rc:-1,message:'few address details are not provided'});
            });
      }).catch(function(err){
          res.json({rc:-1,message:'few details are not provided'});
      });
}).put('/employee/:employeeid/address/:id',function(req,res,next){
    var params=requestparameters.getPostParameters(req);
    employee.updateEmployeeAddressBook(req.params.employeeid,req.params.id,params).then(function(result){
      res.json({rc:0,message:'given employee address is updated'});
    }).catch(function(error){
      res.json({rc:-1,message:'error occurred while updating employee address',details:error.message});
    });
}).delete('/employee/:employeeid/address/:id',function(req,res,next){
  employee.getEmployeeAddressBookById(req.params.employeeid,req.params.id).then(function(address){
    employee.deleteEmployeeAddressBook(address).then(function(callback){
      res.json({rc:0,message:'given employee address is deleted'});
    }).catch(function(error){
      res.json({rc:-1,message:'error occurred while removing employee address',details:error});
    });
  }).catch(function(error){
    res.json({rc:-1,message:'error occurred while removing employee address',details:error.message});
  });
})






;
module.exports = employeerouter;