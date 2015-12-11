'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('VendorAddressBooks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
        City:{
            type:Sequelize.STRING,
            allowNull:false
        },
        Country:{
            type:Sequelize.STRING,
            allowNull:false
        },
        Zipcode:{
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
    return queryInterface.dropTable('VendorAddressBooks');
  }
};