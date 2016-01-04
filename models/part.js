/**
 * Created by kiran on 12/15/15.
 */
'use strict';
module.exports = function(sequelize, DataTypes) {
  var Part = sequelize.define('Part', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name:{
      type:DataTypes.TEXT,
      allowNull:false
    },
    type:{
      type:DataTypes.STRING,
      allowNull:false
    },
    model:{
      type:DataTypes.STRING,
      allowNull:false
    },
    serialnumber:{
      type:DataTypes.TEXT,
      allowNull:false
    },
    category:{
      type:DataTypes.STRING,
      allowNull:false
    },
    subcategory:{
      type:DataTypes.STRING,
      allowNull:true
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    classMethods: {
      associate: function(models) {
        Part.belongsToMany(models.Product, {through:models.ProductPart})
      }
    }
  });
  return Part;
};
