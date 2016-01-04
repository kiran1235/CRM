/**
 * Created by kiran on 12/16/15.
 */
'use strict';
module.exports = function(sequelize, DataTypes) {
  var ProductVendor = sequelize.define('ProductVendor', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    ProductId:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    VendorId:{
      type:DataTypes.INTEGER,
      allowNull:false
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
        ProductVendor.belongsTo(models.Vendor);
        ProductVendor.belongsTo(models.Product);
      }
    }
  });
  return ProductVendor;
};
