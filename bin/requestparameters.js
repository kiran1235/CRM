/**
 * Created by kiran on 12/11/15.
 */

'use strict';

module.exports={
  'getPostParameters':function(req){
    var postparams={};
    var keys=Object.keys(req.body);
    //console.log(req.body);  
    //console.log(keys);
    var keylen=keys.length;
    var chkjson=false;
      
    var _params=req.body;
      
    if(_params.entity !=undefined){
        return _params.entity;
    }  
      
      
    for(var k=0;k<keylen;k++){
      var pattern=/^(entity\[)(\w+)+(\])/g
      var match=pattern.exec(keys[k]);
      if(match[2]!=undefined){
          postparams[match[2]]=req.body[keys[k]];
      }    
    }
    return postparams;
  },
  'getBasicAuthDetais':function(req){
  		var basicauth = require('basic-auth');
	  	var auth=basicauth(req);
	  	return {'email': auth.name, 'hashkey':auth.pass};
  },
  'getHeaders':function(req,param){
  		return req.headers[param];
  }
}