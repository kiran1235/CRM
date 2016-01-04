/**
 * Created by talapaku on 12/5/2015.
 */

var _Sequelize = require('sequelize');
var _sequelize;
var _connectionSuccess=false;
module.exports={
    'connectToDatabase':function(callback){
        _sequelize = new _Sequelize('spos', 'talapaku', 'tkittu', {
            dialect: "postgres", // or 'sqlite', 'postgres', 'mariadb'
            port:    5432 // or 5432 (for postgres)
        });
        _sequelize
            .authenticate()
            .then(function(err) {
                console.log('Connection has been established successfully.');
                callback(false);
            }, function (err) {
                console.log('Unable to connect to the database:', err);
                callback(err);
            });
    },
    'getObject':function(){
        console.log("returning sequelize object");
      return _sequelize;
    }
}




