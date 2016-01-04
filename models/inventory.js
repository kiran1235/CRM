/**
 * Created by kiran on 12/15/15.
 */
'use strict';
module.exports = function(sequelize, DataTypes) {
  var Inventory = sequelize.define('Inventory', {
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
    unitprice:{
      type:DataTypes.DECIMAL(10,2),
      allowNull:false,
      defaultValue:0
    },
    serialnumber:{
      type:DataTypes.TEXT,
      allowNull:false
    },
    instock:{
      type:DataTypes.INTEGER,
      allowNull:false,
      defaultValue:0
    },
    restock:{
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
        Inventory.belongsTo(models.Product);
      }
    }
  });
  return Inventory;
};
