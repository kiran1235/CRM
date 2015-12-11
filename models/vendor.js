'use strict';
module.exports = function(sequelize, DataTypes) {
  var Vendor = sequelize.define('Vendor', {
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
          Vendor.hasMany(models.VendorContact,{onDelete: 'cascade', hooks: true });
          Vendor.hasMany(models.VendorAddressBook,{onDelete: 'cascade', hooks: true });
      }
    }
  });
  return Vendor;
};