/**
 * Created by kiran on 12/15/15.
 */
'use strict';
module.exports = function(sequelize, DataTypes) {
  var Product = sequelize.define('Product', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name:{
      type:DataTypes.TEXT,
      allowNull:false
    },
    type:{
      type:DataTypes.STRING,
      allowNull:false
    },
    model:{
      type:DataTypes.STRING,
      allowNull:false
    },
    serialnumber:{
      type:DataTypes.TEXT,
      allowNull:false
    },
    category:{
      type:DataTypes.STRING,
      allowNull:false
    },
    subcategory:{
      type:DataTypes.STRING,
      allowNull:true
    },
    status:{
      allowNull: false,
      type: DataTypes.INTEGER
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    classMethods: {
      associate: function(models) {
        Product.belongsToMany(models.Part, {through:models.ProductPart})
        Product.belongsToMany(models.Vendor, {through:models.ProductVendor})
      }
    }
  });
  return Product;
};
