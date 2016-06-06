/**
 * Created by kiran on 12/16/15.
 */
'use strict';
module.exports = function(sequelize, DataTypes) {
  var ProductImage = sequelize.define('ProductImage', {
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
    mimetype:{
      type:DataTypes.TEXT,
      allowNull:false
    },
    filename:{
      type:DataTypes.TEXT,
      allowNull:false
    },
    size:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    isdeleted:{
      type:DataTypes.INTEGER,
      allowNull:false,
      defaultValue:0
    }
  }, {
    classMethods: {
      associate: function(models) {
        ProductImage.belongsTo(models.Product);
      }
    }
  });
  return ProductImage;
};
