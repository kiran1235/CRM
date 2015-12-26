/**
 * Created by talapaku on 12/7/2015.
 */

'use strict';

var express = require('express');
var path = require('path');


/** routers & controllers **/
var vendor=require('../controllers/vendor.js');
var vendorrouter = express.Router();
vendorrouter.get('/vendors/',function(req,res,next){
    vendor.get().then(function(vendors){
        res.json({rc:0,data:vendors});
    });
}).post('/vendor/',function(req,res,next){
    var newvendorid=0;
    vendor.create({
        name:req.body['entity[name]']
    }).then(function(_newvendor){
        newvendorid=_newvendor.id;
        vendor.addContact(_newvendor,{
          name:req.body['entity[contactname]']
        }).then(function(_newvendorcontact){
            vendor.addContactAddressBook(_newvendorcontact,{
              addressline1:req.body['entity[addressline1]'],
              addressline2:req.body['entity[addressline2]'],
              street:req.body['entity[street]'],
              city:req.body['entity[city]'],
              country:req.body['entity[country]'],
              zipcode:req.body['entity[zipcode]'],
              email:req.body['entity[email]'],
              phone:req.body['entity[phone]'],
            }).then(function(_newvendorcontact){
              res.json({rc:0,message:'success vendor is addedd',VendorId:newvendorid});
            }).catch(function(err){
              res.json({rc:-1, message:"errored",details:err.message});
            });
        }).catch(function(err){
          vendor.destory(_newvendorcontact).then(function(err){
            res.json({rc:-1,message:'Valid Contact Name is not provided',details:err.message});
          });
        })
            //.addAddressBook(_newvendor,
            //  {
            //    addressline1:req.body['entity[addressline1]'],
            //    addressline2:req.body['entity[addressline2]'],
            //    street:req.body['entity[street]'],
            //    city:req.body['entity[city]'],
            //    country:req.body['entity[country]'],
            //    zipcode:req.body['entity[zipcode]'],
            //    email:req.body['entity[email]'],
            //    phone:req.body['entity[phone]'],
            //})
            //.then(function(_newvendor){
            //    res.json(_newvendor);
            //})
            //.catch(function(err){
            //  console.log(err);
            //    vendor.destory(_newvendor).then(function(err){
            //        res.json({rc:-1,message:'valid address details are not provided',details:err});
            //    }).catch(function(err){
            //        res.json({rc:-1,message:'valid address details are not provided',details:err});
            //    });
            //});
    }).catch(function(err){
      res.json({rc:-1,message:'Valid Vendor Name is not provided',details:err.message});
    });
}).get('/vendor/:id/',function(req,res,next){
  vendor.getById(req.params.id).then(function(vendors){
    res.json({rc:0,data:vendors});
  }).catch(function(err){
    res.json({rc:-1,message:'no vendor found',details:err.message});
  });
}).delete('/vendor/:id',function(req,res,next){
  vendor.delete(req.params.id).then(function(vendor){
    res.json({rc:0,data:vendor});
  });
}).put('/vendor/:id',function(req,res,next){
  vendor.update(req.params.id,{name:req.body['entity[name]']}).then(function(result){
    res.json({rc:0,message:'vendor details are updated',details:result});
  }).catch(function(err){
    console.log(err);
    res.json({rc:-1,message:'error occurred while updating vendor',details:err.message});
  });
}).get('/vendor/:id/addresses/',function(req,res,next){
      vendor.getAddressBookByVendorId(req.params.id).then(function(vendors){
          res.json({rc:0,data:vendors});
      }).catch(function(err){
          res.json({rc:-1,message:'no address is provided'});
      });
}).post('/vendor/:id/address/',function(req,res,next){
      vendor.getById(req.params.id).then(function(_vendor){
          vendor
            .addAddressBook(_vendor,{
                addressline1:req.body['entity[addressline1]'],
                addressline2:req.body['entity[addressline2]'],
                street:req.body['entity[street]'],
                city:req.body['entity[city]'],
                country:req.body['entity[country]'],
                zipcode:req.body['entity[zipcode]'],
                email:req.body['entity[email]'],
                phonenumber:req.body['entity[phonenumber]'],
            })
            .then(function(_vendor){
                res.json(_vendor);
            })
            .catch(function(err){
                res.json({rc:-1,message:'few address details are not provided',details:err}.message);
            });
      }).catch(function(err){
          res.json({rc:-1,message:'few details are not provided',details:err.message});
      });
}).put('/vendor/:vendorid/address/:id',function(req,res,next){
    vendor.updateVendorAddressBook(req.params.vendorid,req.params.id,{
      addressline1:req.body['entity[addressline1]'],
      addressline2:req.body['entity[addressline2]'],
      street:req.body['entity[street]'],
      city:req.body['entity[city]'],
      country:req.body['entity[country]'],
      zipcode:req.body['entity[zipcode]']
    }).then(function(result){
      res.json({rc:0,message:'given vendor address is updated'});
    }).catch(function(error){
      res.json({rc:-1,message:'error occurred while updating vendor address',details:error.message});
    });
}).delete('/vendor/:vendorid/address/:id',function(req,res,next){
  vendor.getVendorAddressBookById(req.params.vendorid,req.params.id).then(function(address){
    vendor.deleteVendorAddressBook(address).then(function(callback){
      res.json({rc:0,message:'given vendor address is deleted'});
    }).catch(function(error){
      res.json({rc:-1,message:'error occurred while removing vendor address',details:error});
    });
  }).catch(function(error){
    res.json({rc:-1,message:'error occurred while removing vendor address',details:error.message});
  });
}).get('/vendor/:id/contacts/',function(req,res,next){
      vendor.getContactByVendorId(req.params.id).then(function(vendors){
          res.json({rc:0,data:vendors});
      }).catch(function(err){
          res.json({rc:-1,message:'no contact is provided'});
      });
}).post('/vendor/:id/contact',function(req,res,next){
    vendor.getById(req.params.id).then(function(_vendor){
      vendor.addContact(_vendor,{
        id:req.params.id,
        name:req.body['entity[name]']
      }).then(function(newvendorcontact){
        vendor.addContactAddressBook(newvendorcontact,{
          addressline1:req.body['entity[addressline1]'],
          addressline2:req.body['entity[addressline2]'],
          street:req.body['entity[street]'],
          city:req.body['entity[city]'],
          country:req.body['entity[country]'],
          zipcode:req.body['entity[zipcode]']
        }).then(function(newvendorcontact){
          res.json(newvendorcontact);
        }).catch(function(err){
          res.json({"error":"errored",message:err});
        });
      });
    }).catch(function(err){
      res.json({rc:-1,message:'no vendor found'});
    });
}).get('/vendor/:vendorid/contact/:id/',function(req,res,next){
  vendor.getContactById(req.params.vendorid,req.params.id).then(function(_contact){
    res.json({rc:0,data:_contact});
  }).catch(function(err){
    res.json({rc:-1,message:'error occurred while fetching contacts'});
  });
}).delete('/vendor/:vendorid/contact/:id',function(req,res,next){
  vendor.getContactById(req.params.vendorid,req.params.id).then(function(_contact){
    vendor.deleteContact(_contact).then(function(callback){
      res.json({rc:0,message:'given contact is deleted'});
    }).catch(function(error){
      res.json({rc:-1,message:'error occurred while removing contact',details:error});
    });
  }).catch(function(error){
    res.json({rc:-1,message:'error occurred while removing contact',details:error});
  });
}).put('/vendor/:vendorid/contact/:id',function(req,res,next){
  vendor.updateContact(req.params.vendorid,req.params.id,{name:req.body['entity[name]']}).then(function(result){
    res.json({rc:0,message:'vendor contact details are updated'});
  }).catch(function(err){
    res.json({rc:-1,message:'error occurred while updating vendor contact',details:err.message});
  });
}).get('/vendor/:vendorid/contact/:id/addresses/',function(req,res,next){
    vendor.getAddressBookByContactId(req.params.vendorid,req.params.id).then(function(_contact){
        res.json({rc:0,data:_contact});
    }).catch(function(err){
        res.json({rc:-1,message:'error occurred while fetching contact address book'});
    });
}).post('/vendor/:vendorid/contact/:id/address/',function(req,res,next){
    vendor.getContactById(req.params.vendorid,req.params.id).then(function(_contact){
        vendor
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
}).delete('/vendor/:vendorid/contact/:contactid/address/:id',function(req,res,next){
  vendor.getContactAddressBookById(req.params.contactid,req.params.id).then(function(address){
    vendor.deleteContactAddressBook(address).then(function(callback){
      res.json({rc:0,message:'given contact address is deleted'});
    }).catch(function(error){
      res.json({rc:-1,message:'error occurred while removing contact address',details:error});
    });
  }).catch(function(error){
    res.json({rc:-1,message:'error occurred while removing contact address',details:error});
  });
}).put('/vendor/:vendorid/contact/:contactid/address/:id',function(req,res,next){
  vendor.getContactById(req.params.vendorid,req.params.contactid).then(function(_contact){
    vendor.updateContactAddressBook(req.params.contactid,req.params.id,{
      addressline1:req.body['entity[addressline1]'],
      addressline2:req.body['entity[addressline2]'],
      street:req.body['entity[street]'],
      city:req.body['entity[city]'],
      country:req.body['entity[country]'],
      zipcode:req.body['entity[zipcode]']
    }).then(function(result){
      res.json({rc:0,message:'given vendor contact address is updated'});
    }).catch(function(error){
      res.json({rc:-1,message:'error occurred while updating vendor contact address',details:error.message});
    });
  }).catch(function(err){
    res.json({rc:-1,message:'error occurred while updating vendor contact address',details:err.message});
  });

})


;
module.exports = vendorrouter;