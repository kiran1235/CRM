'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Inventories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ProductId:{
        type:Sequelize.INTEGER,
        allowNull:false
      },
      unitprice:{
        type:Sequelize.DECIMAL(10,2),
        allowNull:false,
        defaultValue:0
      },
      serialnumber:{
        type:Sequelize.TEXT,
        allowNull:false
      },
      instock:{
        type:Sequelize.INTEGER,
        allowNull:false,
        defaultValue:0
      },
      restock:{
        type:Sequelize.INTEGER,
        allowNull:false,
        defaultValue:0
      },
      isdeleted:{
        type:Sequelize.INTEGER,
        allowNull:false,
        defaultValue:0
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
    return queryInterface.dropTable('Inventories');
  }
};
