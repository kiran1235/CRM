'use strict';
module.exports = function(sequelize, DataTypes) {
  var OrderPaymetDetails = sequelize.define('OrderPaymetDetails', {
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
      CustomerId:{
          type: DataTypes.INTEGER,
          allowNull: false
      },
      CustomerBillingAddressBookId:{
          type: DataTypes.INTEGER,
          allowNull: false          
      },
      paymentType: {
        allowNull: false,
        type: DataTypes.TEXT
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
      }
    }
  });
  return OrderPaymetDetails;
};