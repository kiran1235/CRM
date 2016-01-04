'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name:{
        type:Sequelize.TEXT,
        allowNull:false
      },
      type:{
        type:Sequelize.STRING,
        allowNull:false
      },
      model:{
        type:Sequelize.STRING,
        allowNull:false
      },
      serialnumber:{
        type:Sequelize.TEXT,
        allowNull:false
      },
      category:{
        type:Sequelize.STRING,
        allowNull:false
      },
      subcategory:{
        type:Sequelize.STRING,
        allowNull:true
      },
      status:{
        allowNull: false,
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('Products');
  }
};