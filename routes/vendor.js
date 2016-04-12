/**
 * Created by talapaku on 12/7/2015.
 */

'use strict';

var express = require('express');
var path = require('path');
var requestparameters=require('../bin/requestparameters.js');

/** routers & controllers **/
var vendor=require('../controllers/vendor.js');
var vendorrouter = express.Router();
vendorrouter.get('/vendors/',function(req,res,next){
  vendor.get().then(function(vendors){
    res.json({rc:0,data:vendors});
  });

  //setTimeout(function() {
  //  vendor.get().then(function(vendors){
  //    res.json({rc:0,data:vendors});
  //  });
  //}, 1000);

}).post('/vendors/',function(req,res,next){
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
}).get('/vendors/:id/',function(req,res,next){
  vendor.getById(req.params.id).then(function(vendors){
    res.json({rc:0,data:vendors});
  }).catch(function(err){
    res.json({rc:-1,message:'no vendor found',details:err.message});
  });
}).delete('/vendors/:id',function(req,res,next){
  vendor.delete(req.params.id).then(function(vendor){
    res.json({rc:0,data:vendor});
  });
}).put('/vendors/:id',function(req,res,next){
  vendor.update(req.params.id,{name:req.body['entity[name]']}).then(function(result){
    res.json({rc:0,message:'vendor details are updated',details:result});
  }).catch(function(err){
    console.log(err);
    res.json({rc:-1,message:'error occurred while updating vendor',details:err.message});
  });
}).get('/vendors/:id/addresses/',function(req,res,next){
      vendor.getAddressBookByVendorId(req.params.id).then(function(vendors){
          res.json({rc:0,data:vendors});
      }).catch(function(err){
          res.json({rc:-1,message:'no address is provided'});
      });
}).post('/vendors/:id/address/',function(req,res,next){
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
}).put('/vendors/:vendorid/address/:id',function(req,res,next){
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
}).delete('/vendors/:vendorid/address/:id',function(req,res,next){
  vendor.getVendorAddressBookById(req.params.vendorid,req.params.id).then(function(address){
    vendor.deleteVendorAddressBook(address).then(function(callback){
      res.json({rc:0,message:'given vendor address is deleted'});
    }).catch(function(error){
      res.json({rc:-1,message:'error occurred while removing vendor address',details:error});
    });
  }).catch(function(error){
    res.json({rc:-1,message:'error occurred while removing vendor address',details:error.message});
  });
}).get('/vendors/:id/contacts/',function(req,res,next){
      vendor.getContactByVendorId(req.params.id).then(function(vendors){
          res.json({rc:0,data:vendors});
      }).catch(function(err){
          res.json({rc:-1,message:'no contact is provided'});
      });
}).post('/vendors/:id/contacts',function(req,res,next){
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
}).get('/vendors/:vendorid/contacts/:id/',function(req,res,next){
  vendor.getContactById(req.params.vendorid,req.params.id).then(function(_contact){
    res.json({rc:0,data:_contact});
  }).catch(function(err){
    res.json({rc:-1,message:'error occurred while fetching contacts'});
  });
}).delete('/vendors/:vendorid/contacts/:id',function(req,res,next){
  vendor.getContactById(req.params.vendorid,req.params.id).then(function(_contact){
    vendor.deleteContact(_contact).then(function(callback){
      res.json({rc:0,message:'given contact is deleted'});
    }).catch(function(error){
      res.json({rc:-1,message:'error occurred while removing contact',details:error});
    });
  }).catch(function(error){
    res.json({rc:-1,message:'error occurred while removing contact',details:error});
  });
}).put('/vendors/:vendorid/contacts/:id',function(req,res,next){
  vendor.updateContact(req.params.vendorid,req.params.id,{name:req.body['entity[name]']}).then(function(result){
    res.json({rc:0,message:'vendor contact details are updated'});
  }).catch(function(err){
    res.json({rc:-1,message:'error occurred while updating vendor contact',details:err.message});
  });
}).get('/vendors/:vendorid/contacts/:id/addresses/',function(req,res,next){
    vendor.getAddressBookByContactId(req.params.vendorid,req.params.id).then(function(_contact){
        res.json({rc:0,data:_contact});
    }).catch(function(err){
        res.json({rc:-1,message:'error occurred while fetching contact address book'});
    });
}).post('/vendors/:vendorid/contacts/:id/address/',function(req,res,next){
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
}).delete('/vendors/:vendorid/contacts/:contactid/address/:id',function(req,res,next){
  vendor.getContactAddressBookById(req.params.contactid,req.params.id).then(function(address){
    vendor.deleteContactAddressBook(address).then(function(callback){
      res.json({rc:0,message:'given contact address is deleted'});
    }).catch(function(error){
      res.json({rc:-1,message:'error occurred while removing contact address',details:error});
    });
  }).catch(function(error){
    res.json({rc:-1,message:'error occurred while removing contact address',details:error});
  });
}).put('/vendors/:vendorid/contacts/:contactid/address/:id',function(req,res,next){
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




.get('/vendors/:id/products',function(req,res,next){
    vendor.getProducts(req.params.id).then(function(products){
      res.json({rc:0,data:products});
    });
}).post('/vendors/:id/products',function(req,res,next){
  var self= this;
    
    vendor.addProduct(req.params.id,
        requestparameters.getPostParameters(req)
    ).then(function(_newproduct){
        res.json({rc:0,data:_newproduct});
    }).catch(function(err){
      res.json({rc:-1,message:'few product details are not provided',details:err});
    });
})








;
module.exports = vendorrouter;