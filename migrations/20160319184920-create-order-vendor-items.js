'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('OrderVendorItems', {
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
      OrderVendorId:{
          type: Sequelize.INTEGER,
          allowNull: false       
      },        
      InventoryId:{
          type: Sequelize.INTEGER,
          allowNull: false       
      },
      ProductId:{
          type: Sequelize.INTEGER,
          allowNull: false       
      },        
      productName:{
          type: Sequelize.TEXT,
          allowNull: false       
      },         
      unitprice:{
          type: Sequelize.FLOAT,
          allowNull: false       
      }, 
      vat:{
          type: Sequelize.FLOAT,
          allowNull: false       
      },
      discountamount:{
          type: Sequelize.FLOAT,
          allowNull: false       
      }, 
      quantity:{
          type: Sequelize.FLOAT,
          allowNull: false       
      }, 
      measureunit:{
          type: Sequelize.TEXT,
          allowNull: false       
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
    return queryInterface.dropTable('OrderVendorItems');
  }

};
