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
          allowNull:true,
          notEmpty: true,
          validate: {
              is: ["^[a-zA-Z0-9 \-\\\/\#\.]+$", 'i']
          }
      },
      addressline2:{
          type:DataTypes.TEXT,
          allowNull:true,
          validate: {
              is: ["^[a-zA-Z0-9 \-\\\/\#\.]+$", 'i']
          }
      },
      street:{
          type:DataTypes.TEXT,
          allowNull:true,
          validate: {
              is: ["^[a-zA-Z0-9 \-\\\/\#\.]+$", 'i']
          }
      },
      city:{
          type:DataTypes.STRING,
          allowNull:true,
          validate: {
              is: ["^[a-zA-Z ]+$", 'i']
          }
      },
      country:{
          type:DataTypes.STRING,
          allowNull:true,
          validate: {
              is: ["^[a-zA-Z ]+$", 'i']
          }
      },
      zipcode:{
          type:DataTypes.STRING,
          allowNull:true,
          validate: {
              is: ["^[a-zA-Z0-9 \-]+$", 'i']
          }
      },
      email:{
          type:DataTypes.STRING,
          allowNull:true,
          defaultValue:'na@default',
      },
      phone:{
          type:DataTypes.STRING,
          allowNull:true,
          defaultValue:'0000000000',
          validate: {
              is: ["^[0-9]+$", 'i']
          }
      },
      isprimary:{
          type:DataTypes.INTEGER,
          allowNull:false,
          defaultValue:0
      },
      isdeleted:{
          type:DataTypes.INTEGER,
          allowNull:false,
          defaultValue:0
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