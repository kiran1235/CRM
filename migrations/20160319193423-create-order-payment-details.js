'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('OrderPaymentDetails', {
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
      CustomerId:{
          type: Sequelize.INTEGER,
          allowNull: false
      },
      CustomerBillingAddressBookId:{
          type: Sequelize.INTEGER,
          allowNull: false          
      },
      paymentType: {
        allowNull: false,
        type: Sequelize.TEXT
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
      }    
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('OrderPaymentDetails');
  }

};
