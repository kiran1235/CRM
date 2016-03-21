'use strict';

var Promise = require("bluebird");

/** load models **/
var models = require('../models/index.js');
var crypto = require('crypto');
var User = {
    'login':function(options){
       return new Promise(function(resolve,reject) {
           var _h=crypto.createHash('md5').update(options['email']+'&'+options['hashkey']).digest('hex');
           models.User.findOne({
               where:{email:options['email'],hashkey:_h}
           }).then(function (user) {
                if(!user){
                    throw new Error("User Not Found");
                }else{
                    var _h=crypto.createHash('md5').update(user.authkey).digest('hex');
                    user.update({'authkey':_h});
                    resolve(user);
                }
           }).catch(function (error) {
               console.log(err);
               reject(error);
           });
       });        
    },
    'auth':function(options){
       return new Promise(function(resolve,reject) {
           models.User.findOne({
               where:{authkey:options['authkey']}
           }).then(function (user) {
                if(!user){
                    throw new Error("User Not Found");
                }else{
                    resolve(user);
                }
           }).catch(function (error) {
               console.log(err);
               reject(error);
           });
       });        
    },    
}

module.exports = User;