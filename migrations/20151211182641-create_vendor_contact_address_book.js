'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('VendorContactAddressBooks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      VendorContactId:{
        type: Sequelize.INTEGER,
        allowNull:false
      },
      addressline1:{
        type:Sequelize.TEXT,
        allowNull:false
      },
      addressline2:{
        type:Sequelize.TEXT,
        allowNull:true
      },
      street:{
        type:Sequelize.TEXT,
        allowNull:false
      },
      city:{
        type:Sequelize.STRING,
        allowNull:false
      },
      country:{
        type:Sequelize.STRING,
        allowNull:false
      },
      zipcode:{
        type:Sequelize.STRING,
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
    return queryInterface.dropTable('VendorContactAddressBooks');
  }
};