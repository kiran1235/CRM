/**
 * Created by kiran on 12/15/15.
 */
'use strict';
module.exports = function(sequelize, DataTypes) {
  var Product = sequelize.define('Product', {
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
  }, {
    classMethods: {
      associate: function(models) {
      }
    }
  });
  return Product;
};
