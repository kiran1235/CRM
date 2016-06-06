'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('OrderSignatures', {
              id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
              },  
              OrderId:{
                  type: Sequelize.INTEGER,
                  allowNull: false          
              },
              EmployeeId:{
                  type: Sequelize.INTEGER,
                  allowNull: false          
              },        
              OrderVendorId:{
                  type: Sequelize.INTEGER,
                  allowNull: false
              },
              CustomerId:{
                type: Sequelize.INTEGER,
                allowNull:false
              },
              VendorPickupSignature:{
                type: Sequelize.TEXT,
                allowNull:true
              },
              EmployeePickupSignature:{
                type: Sequelize.TEXT,
                allowNull:true
              },
              CustomerDeliverySignature:{
                type: Sequelize.TEXT,
                allowNull:true
              },
              EmployeeDeliverySignature:{
                type: Sequelize.TEXT,
                allowNull:true
              }, 
              status: {
                allowNull: false,
                type: Sequelize.TEXT
              },          
              createdAt: {
                allowNull: false,
                type: Sequelize.DATE
              },
              updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
              }             
        });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('OrderSignatures');
  }
};
