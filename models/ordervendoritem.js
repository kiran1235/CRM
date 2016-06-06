'use strict';
module.exports = function(sequelize, DataTypes) {
  var OrderVendorItem = sequelize.define('OrderVendorItem', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      OrderId:{
          type: DataTypes.INTEGER,
          allowNull: false
      },
      OrderVendorId:{
          type: DataTypes.INTEGER,
          allowNull: false       
      },        
      InventoryId:{
          type: DataTypes.INTEGER,
          allowNull: false       
      },
      ProductId:{
          type: DataTypes.INTEGER,
          allowNull: false       
      },        
      productName:{
          type: DataTypes.TEXT,
          allowNull: false       
      },         
      unitprice:{
          type: DataTypes.FLOAT,
          allowNull: false       
      }, 
      vat:{
          type: DataTypes.FLOAT,
          allowNull: false       
      },
      discountamount:{
          type: DataTypes.FLOAT,
          allowNull: false       
      }, 
      quantity:{
          type: DataTypes.FLOAT,
          allowNull: false       
      }, 
      measureunit:{
          type: DataTypes.TEXT,
          allowNull: false       
      },        
      status: {
        allowNull: false,
        type: DataTypes.TEXT
      },          
      isdeleted:{
        type:DataTypes.INTEGER,
        allowNull:false
      }
  }, {
    classMethods: {
      associate: function(models) {
        OrderVendorItem.belongsTo(models.OrderVendor);
      }
    }
  });
  return OrderVendorItem;
};