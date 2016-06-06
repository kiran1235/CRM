'use strict';
module.exports = function(sequelize, DataTypes) {
  var Customer = sequelize.define('Customer', {
      id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER
      },
      name:{
          type:DataTypes.TEXT,
          allowNull: false,
          validate: {
              notEmpty: true,
              is: ["^[a-zA-Z0-9 \-\\\/\#\.]+$", 'i']
          }
      }
  }, {
    classMethods: {
      associate: function(models) {
          Customer.hasMany(models.CustomerContact,{onDelete: 'cascade', hooks: true });
          Customer.hasMany(models.CustomerAddressBook,{onDelete: 'cascade', hooks: true });
      }
    }
  });
  return Customer;
};