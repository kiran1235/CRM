/**
 * Created by talapaku on 12/7/2015.
 */

'use strict';

var express = require('express');
var path = require('path');


/** routers & controllers **/
var customer=require('../controllers/customer.js');
var customerrouter = express.Router();
customerrouter.get('/customers/',function(req,res,next){
    customer.get().then(function(customers){
        res.json({rc:0,data:customers});
    });
}).post('/customer/',function(req,res,next){
    customer.create({
        name:req.body['entity[name]']
    }).then(function(_newcustomer){
        customer
            .addAddressBook(_newcustomer,{
                addressline1:req.body['entity[addressline1]'],
                addressline2:req.body['entity[addressline2]'],
                street:req.body['entity[street]'],
                city:req.body['entity[city]'],
                country:req.body['entity[country]'],
                zipcode:req.body['entity[zipcode]']
            })
            .then(function(_newcustomer){
                res.json(_newcustomer);
            })
            .catch(function(err){
                customer.destroy(newcustomer).then(function(err){
                    res.json({rc:-1,message:'address details are not provided',details:err});
                }).catch(function(err){
                    res.json({rc:-1,message:'address details are not provided',details:err});
                });
            });
    });
}).get('/customer/:id/',function(req,res,next){
  customer.getById(req.params.id).then(function(customers){
    res.json({rc:0,data:customers});
  }).catch(function(err){
    res.json({rc:-1,message:'no customer found'});
  });
}).delete('/customer/:id',function(req,res,next){
  customer.delete(req.params.id).then(function(customer){
    res.json({rc:0,data:customer});
  });
}).put('/customer/:id',function(req,res,next){
  customer.update(req.params.id,{name:req.body['entity[name]']}).then(function(result){
    res.json({rc:0,message:'customer details are updated',details:result});
  }).catch(function(err){
    console.log(err);
    res.json({rc:-1,message:'error occurred while updating customer',details:err.message});
  });
}).get('/customer/:id/addresses/',function(req,res,next){
      customer.getAddressBookByCustomerId(req.params.id).then(function(customers){
          res.json({rc:0,data:customers});
      }).catch(function(err){
          res.json({rc:-1,message:'no address is provided'});
      });
}).post('/customer/:id/address/',function(req,res,next){
      customer.getById(req.params.id).then(function(_customer){
          customer
            .addAddressBook(_customer,{
                addressline1:req.body['entity[addressline1]'],
                addressline2:req.body['entity[addressline2]'],
                street:req.body['entity[street]'],
                city:req.body['entity[city]'],
                country:req.body['entity[country]'],
                zipcode:req.body['entity[zipcode]']
            })
            .then(function(_customer){
                res.json(_customer);
            })
            .catch(function(err){
                res.json({rc:-1,message:'few address details are not provided',details:err}.message);
            });
      }).catch(function(err){
          res.json({rc:-1,message:'few details are not provided',details:err.message});
      });
}).put('/customer/:customerid/address/:id',function(req,res,next){
    customer.updateCustomerAddressBook(req.params.customerid,req.params.id,{
      addressline1:req.body['entity[addressline1]'],
      addressline2:req.body['entity[addressline2]'],
      street:req.body['entity[street]'],
      city:req.body['entity[city]'],
      country:req.body['entity[country]'],
      zipcode:req.body['entity[zipcode]']
    }).then(function(result){
      res.json({rc:0,message:'given customer address is updated'});
    }).catch(function(error){
      res.json({rc:-1,message:'error occurred while updating customer address',details:error.message});
    });
}).delete('/customer/:customerid/address/:id',function(req,res,next){
  customer.getCustomerAddressBookById(req.params.customerid,req.params.id).then(function(address){
    customer.deleteCustomerAddressBook(address).then(function(callback){
      res.json({rc:0,message:'given customer address is deleted'});
    }).catch(function(error){
      res.json({rc:-1,message:'error occurred while removing customer address',details:error});
    });
  }).catch(function(error){
    res.json({rc:-1,message:'error occurred while removing customer address',details:error.message});
  });
}).get('/customer/:id/contacts/',function(req,res,next){
      customer.getContactByCustomerId(req.params.id).then(function(customers){
          res.json({rc:0,data:customers});
      }).catch(function(err){
          res.json({rc:-1,message:'no contact is provided'});
      });
}).post('/customer/:id/contact',function(req,res,next){
    customer.getById(req.params.id).then(function(_customer){
      customer.addContact(_customer,{
        id:req.params.id,
        name:req.body['entity[name]']
      }).then(function(newcustomercontact){
        customer.addContactAddressBook(newcustomercontact,{
          addressline1:req.body['entity[addressline1]'],
          addressline2:req.body['entity[addressline2]'],
          street:req.body['entity[street]'],
          city:req.body['entity[city]'],
          country:req.body['entity[country]'],
          zipcode:req.body['entity[zipcode]']
        }).then(function(newcustomercontact){
          res.json(newcustomercontact);
        }).catch(function(err){
          res.json({"error":"errored",message:err});
        });
      });
    }).catch(function(err){
      res.json({rc:-1,message:'no customer found'});
    });
}).get('/customer/:customerid/contact/:id/',function(req,res,next){
  customer.getContactById(req.params.customerid,req.params.id).then(function(_contact){
    res.json({rc:0,data:_contact});
  }).catch(function(err){
    res.json({rc:-1,message:'error occurred while fetching contacts'});
  });
}).delete('/customer/:customerid/contact/:id',function(req,res,next){
  customer.getContactById(req.params.customerid,req.params.id).then(function(_contact){
    customer.deleteContact(_contact).then(function(callback){
      res.json({rc:0,message:'given contact is deleted'});
    }).catch(function(error){
      res.json({rc:-1,message:'error occurred while removing contact',details:error});
    });
  }).catch(function(error){
    res.json({rc:-1,message:'error occurred while removing contact',details:error});
  });
}).put('/customer/:customerid/contact/:id',function(req,res,next){
  customer.updateContact(req.params.customerid,req.params.id,{name:req.body['entity[name]']}).then(function(result){
    res.json({rc:0,message:'customer contact details are updated'});
  }).catch(function(err){
    res.json({rc:-1,message:'error occurred while updating customer contact',details:err.message});
  });
}).get('/customer/:customerid/contact/:id/addresses/',function(req,res,next){
    customer.getAddressBookByContactId(req.params.customerid,req.params.id).then(function(_contact){
        res.json({rc:0,data:_contact});
    }).catch(function(err){
        res.json({rc:-1,message:'error occurred while fetching contact address book'});
    });
}).post('/customer/:customerid/contact/:id/address/',function(req,res,next){
    customer.getContactById(req.params.customerid,req.params.id).then(function(_contact){
        customer
          .addContactAddressBook(_contact,{
              addressline1:req.body['entity[addressline1]'],
              addressline2:req.body['entity[addressline2]'],
              street:req.body['entity[street]'],
              city:req.body['entity[city]'],
              country:req.body['entity[country]'],
              zipcode:req.body['entity[zipcode]']
          })
          .then(function(_contact){
              res.json(_contact);
          })
          .catch(function(err){
              res.json({rc:-1,message:'few contact address details are not provided',details:err});
          });
    }).catch(function(err){
        res.json({rc:-1,message:'few contact details are not provided',details:err});
    });
}).delete('/customer/:customerid/contact/:contactid/address/:id',function(req,res,next){
  customer.getContactAddressBookById(req.params.contactid,req.params.id).then(function(address){
    customer.deleteContactAddressBook(address).then(function(callback){
      res.json({rc:0,message:'given contact address is deleted'});
    }).catch(function(error){
      res.json({rc:-1,message:'error occurred while removing contact address',details:error});
    });
  }).catch(function(error){
    res.json({rc:-1,message:'error occurred while removing contact address',details:error});
  });
}).put('/customer/:customerid/contact/:contactid/address/:id',function(req,res,next){
  customer.getContactById(req.params.customerid,req.params.contactid).then(function(_contact){
    customer.updateContactAddressBook(req.params.contactid,req.params.id,{
      addressline1:req.body['entity[addressline1]'],
      addressline2:req.body['entity[addressline2]'],
      street:req.body['entity[street]'],
      city:req.body['entity[city]'],
      country:req.body['entity[country]'],
      zipcode:req.body['entity[zipcode]']
    }).then(function(result){
      res.json({rc:0,message:'given customer contact address is updated'});
    }).catch(function(error){
      res.json({rc:-1,message:'error occurred while updating customer contact address',details:error.message});
    });
  }).catch(function(err){
    res.json({rc:-1,message:'error occurred while updating customer contact address',details:err.message});
  });

})


;
module.exports = customerrouter;