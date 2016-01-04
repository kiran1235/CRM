'use strict';
module.exports = function(sequelize, DataTypes) {
  var CustomerContactAddressBook = sequelize.define('CustomerContactAddressBook', {
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
      city:{
          type:DataTypes.STRING,
          allowNull:false,
          validate: {
              notEmpty: true,
              is: ["^[a-zA-Z ]+$", 'i']
          }
      },
      country:{
          type:DataTypes.STRING,
          allowNull:false,
          validate: {
              notEmpty: true,
              is: ["^[a-zA-Z ]+$", 'i']
          }
      },
      zipcode:{
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
          CustomerContactAddressBook.belongsTo(models.CustomerContact);
      }
    }
  });
  return CustomerContactAddressBook;
};