//var express = require('express');
//var router = express.Router();
//
///* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'SMB' });
//});
//
//module.exports = router;


'use strict';

var fs        = require('fs');
var path      = require('path');
var basename  = path.basename(module.filename);
var routers=[];

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== basename);
    })
    .forEach(function(file) {
        if (file.slice(-3) !== '.js') return;
        var router = require(path.join(__dirname, file));
        routers.push(router);
    });


module.exports=routers;