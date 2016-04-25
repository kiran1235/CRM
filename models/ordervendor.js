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
          allowNull: false,
          defaultValue:0,
      },        
      VendorId:{
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue:0,
      },
      VendorContactAddressBookId:{
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue:0,
      }, 
      processedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue:'9999-12-31',  
      },
      pickedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue:'9999-12-31', 
      },
      status: {
        allowNull: false,
        type: DataTypes.TEXT,
        defaultValue:'new', 
      },          
      isdeleted:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0, 
      },
      EmployeeSignatureImageId:{
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue:0,             
      },    
      VendorSignatureImageId:{
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue:0,             
      }  
  }, {
    classMethods: {
      associate: function(models) {
          OrderVendor.belongsTo(models.Order);
          OrderVendor.hasMany(models.OrderVendorItem,{onDelete: 'cascade', hooks: true });
          OrderVendor.hasMany(models.OrderSignature,{onDelete: 'cascade', hooks: true });
          OrderVendor.belongsTo(models.VendorContactAddressBook);
          OrderVendor.belongsTo(models.Vendor);
      }
    }
  });
  return OrderVendor;
};