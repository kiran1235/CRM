'use strict';
module.exports = function(sequelize, DataTypes) {
  var Order = sequelize.define('Order', {
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
      EmployeeId:{
          type: DataTypes.INTEGER,
          allowNull: false          
      },        
      CustomerId:{
          type: DataTypes.INTEGER,
          allowNull: false
      },
      CustomerDeliveryAddressBookId:{
          type: DataTypes.INTEGER,
          allowNull: false          
      }, 
      CustomerBillingAddressBookId:{
          type: DataTypes.INTEGER,
          allowNull: false          
      },
      scheduleAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      deliveryAt: {
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
      CustomerSignatureImageId:{
          type: DataTypes.INTEGER,
          allowNull: false            
      }
  }, {
    classMethods: {
      associate: function(models) {
          Order.hasMany(models.OrderVendorItem);
          Order.hasMany(models.OrderVendor);
          Order.belongsToMany(models.Vendor, {through:models.OrderVendor});
          Order.belongsToMany(models.VendorContactAddressBook, {through:models.OrderVendor});
          Order.belongsTo(models.Customer, {foreignKey:'CustomerId'});
          Order.belongsTo(models.CustomerContactAddressBook, {foreignKey:'CustomerDeliveryAddressBookId'});
          Order.hasMany(models.OrderPaymetDetails);
          Order.hasMany(models.OrderSignature);
      }
    }
  });
  return Order;
};