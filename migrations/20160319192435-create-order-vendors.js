'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('OrderVendors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.TEXT
      },  
      OrderId:{
          type: Sequelize.INTEGER,
          allowNull: false          
      },        
      EmployeeId:{
          type: Sequelize.INTEGER,
          allowNull: false          
      },        
      VendorId:{
          type: Sequelize.INTEGER,
          allowNull: false
      },
      VendorContactAddressBookId:{
          type: Sequelize.INTEGER,
          allowNull: false          
      }, 
      processedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      pickedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      status: {
        allowNull: false,
        type: Sequelize.TEXT
      },          
      isdeleted:{
        type:Sequelize.INTEGER,
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      EmployeeSignatureImageId:{
          type: Sequelize.INTEGER,
          allowNull: false            
      },    
      VendorSignatureImageId:{
          type: Sequelize.INTEGER,
          allowNull: false            
      }    
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('OrderVendors');
  }

};
