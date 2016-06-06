'use strict';
module.exports = function(sequelize, DataTypes) {
  var VendorContact = sequelize.define('VendorContact', {
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
      },

  }, {
    classMethods: {
      associate: function(models) {
          VendorContact.belongsTo(models.Vendor);
          VendorContact.hasMany(models.VendorContactAddressBook,{onDelete: 'cascade', hooks: true });
      }
    }
  });
  return VendorContact;
};