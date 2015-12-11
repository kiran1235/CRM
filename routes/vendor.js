/**
 * Created by talapaku on 12/7/2015.
 */


var express = require('express');
var path = require('path');


/** routers & controllers **/
var vendor=require('../controllers/vendor.js');
var vendorrouter = express.Router();
vendorrouter.get('/vendor',function(req,res,next){
    vendor.get().then(function(vendors){
        res.json(vendors);
    });
}).get('/vendor/:id/address',function(req,res,next){
    vendor.getAddressBookById(req.params.id).then(function(vendors){
        res.json(vendors);
    });
}).post('/vendor/new',function(req,res,next){
    vendor.create({
        name:req.body['entity[name]']
    }).then(function(newvendor){
        vendor.addAddressBook({
            id:newvendor["id"],
            addressline1:req.body['entity[addr1]'],
            addressline2:req.body['entity[addr2]'],
            street:req.body['entity[street]'],
            City:req.body['entity[city]'],
            Country:req.body['entity[country]'],
            Zipcode:req.body['entity[zip]']
        }).then(function(newvendor){
            res.json(newvendor);
        }).catch(function(err){
            res.json({"error":"errored",message:err});
        });
    });
}).post('/vendor/:id/contact',function(req,res,next){
    //request=JSON.parse(JSON.stringify(req.body));
    //
    //console.log(request);
    //
    //res.json(request);
    vendor.addContact({
        id:req.params.id,
        name:req.body['request[name]']
    }).then(function(newvendorcontact){
        res.json(newvendorcontact);
        //vendor.addContactAddressBook({
        //    id:newvendorcontact["id"],
        //    addressline1:req.body['request[addr1]'],
        //    addressline2:req.body['request[addr2]'],
        //    street:req.body['request[street]'],
        //    City:req.body['request[city]'],
        //    Country:req.body['request[country]'],
        //    Zipcode:req.body['request[zip]']
        //}).then(function(newvendorcontact){
        //    res.json(newvendorcontact);
        //}).catch(function(err){
        //    res.json({"error":"errored",message:err});
        //});
    });
})

module.exports = vendorrouter;