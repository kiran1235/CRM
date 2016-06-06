/**
 * Created by kiran on 12/16/15.
 */
'use strict';
module.exports = function(sequelize, DataTypes) {
  var ProductPart = sequelize.define('ProductPart', {
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
      PartId:{
        type:DataTypes.INTEGER,
        allowNull:false
      },
      isdeleted:{
        type:DataTypes.INTEGER,
        allowNull:false
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
      }
    }
  });
  return ProductPart;
};
