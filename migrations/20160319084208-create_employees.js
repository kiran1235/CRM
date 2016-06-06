'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Employees', {
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
      gender:{
        type:Sequelize.TEXT,
        allowNull:false
      },        
      email:{
        type:Sequelize.TEXT,
        allowNull:false
      },
      doj:{
        type:Sequelize.DATE,
        allowNull:false
      },
      dob:{
        type:Sequelize.DATE,
        allowNull:false
      },
      dol:{
        type:Sequelize.DATE,
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
    return queryInterface.dropTable('Employees');
  }

};
