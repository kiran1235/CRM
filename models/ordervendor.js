'use strict';
module.exports = function(sequelize, DataTypes) {
  var OrderVendor = sequelize.define('OrderVendor', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      OrderId:{
          type: DataTypes.INTEGER,
          allowNull: false          
      },
      EmployeeId:{
          type: DataTypes.INTEGER,
          allowNull: false          
      },        
      VendorId:{
          type: DataTypes.INTEGER,
          allowNull: false
      },
      VendorContactAddressBookId:{
          type: DataTypes.INTEGER,
          allowNull: false          
      }, 
      processedAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      pickedAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      status: {
        allowNull: false,
        type: DataTypes.TEXT
      },          
      isdeleted:{
        type:DataTypes.INTEGER,
        allowNull:false
      },
      EmployeeSignatureImageId:{
          type: DataTypes.INTEGER,
          allowNull: false            
      },    
      VendorSignatureImageId:{
          type: DataTypes.INTEGER,
          allowNull: false            
      }  
  }, {
    classMethods: {
      associate: function(models) {
      }
    }
  });
  return OrderVendor;
};