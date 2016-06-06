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
        VendorId:{
            type: Sequelize.INTEGER,
            allowNull:false
        },
      addressline1:{
        type:Sequelize.TEXT,
          allowNull:true
      },
      addressline2:{
          type:Sequelize.TEXT,
          allowNull:true
      },
      street:{
          type:Sequelize.TEXT,
          allowNull:true
      },
      city:{
          type:Sequelize.STRING,
          allowNull:true
      },
      country:{
          type:Sequelize.STRING,
          allowNull:true
      },
      zipcode:{
          type:Sequelize.STRING,
          allowNull:true
      },
      email:{
        type:Sequelize.TEXT,
        allowNull:true
      },
      phone:{
        type:Sequelize.STRING,
        allowNull:true
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
    return queryInterface.dropTable('VendorAddressBooks');
  }
};