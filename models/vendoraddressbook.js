'use strict';
module.exports = function(sequelize, DataTypes) {
  var VendorAddressBook = sequelize.define('VendorAddressBook', {
      id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER
      },
      addressline1:{
          type:DataTypes.TEXT,
          allowNull:false,
          notEmpty: true,
          validate: {
              notEmpty: true,
              is: ["^[a-zA-Z0-9 \-\\\/\#\.]+$", 'i']
          }
      },
      addressline2:{
          type:DataTypes.TEXT,
          allowNull:true,
          validate: {
              notEmpty: true,
              is: ["^[a-zA-Z0-9 \-\\\/\#\.]+$", 'i']
          }
      },
      street:{
          type:DataTypes.TEXT,
          allowNull:false,
          validate: {
              notEmpty: true,
              is: ["^[a-zA-Z0-9 \-\\\/\#\.]+$", 'i']
          }
      },
      City:{
          type:DataTypes.STRING,
          allowNull:false,
          validate: {
              notEmpty: true,
              is: ["^[a-zA-Z ]+$", 'i']
          }
      },
      Country:{
          type:DataTypes.STRING,
          allowNull:false,
          validate: {
              notEmpty: true,
              is: ["^[a-zA-Z ]+$", 'i']
          }
      },
      Zipcode:{
          type:DataTypes.STRING,
          allowNull:false,
          notEmpty: true,
          validate: {
              notEmpty: true,
              is: ["^[a-zA-Z0-9 \-]+$", 'i']
          }
      }
  }, {
    classMethods: {
      associate: function(models) {
          VendorAddressBook.belongsTo(models.Vendor);
      }
    }
  });
  return VendorAddressBook;
};