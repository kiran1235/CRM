'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
      id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER
      },
      email:{
          type:DataTypes.TEXT,
          allowNull: false
      },      
      hashkey:{
          type:DataTypes.TEXT,
          allowNull: false
      },
      parentType:{
          type: DataTypes.TEXT,
          allowNull: false
      },
      parentId:{
          type: DataTypes.INTEGER,
          allowNull: false
      },
      authkey:{
          type: DataTypes.TEXT,
          allowNull: false          
      }
  }, {
    classMethods: {
      associate: function(models) {
          User.belongsTo(models.Employee,{onDelete: 'cascade', hooks: true,foreignKey: 'parentId' , foreignKeyConstraint:true });
          User.belongsTo(models.Vendor,{onDelete: 'cascade', hooks: true,foreignKey: 'parentId' , foreignKeyConstraint:true });
      }
    }
  });
  return User;
};