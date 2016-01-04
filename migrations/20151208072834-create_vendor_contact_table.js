'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('VendorContacts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      VendorId:{
        type: Sequelize.INTEGER,
        allowNull:false
      },
      name:{
        type:Sequelize.TEXT
      },
      isprimary:{
        type:Sequelize.INTEGER,
        allowNull:false
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
    return queryInterface.dropTable('VendorContacts');
  }
};