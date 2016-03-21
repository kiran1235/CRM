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
      parentId:{
          type: DataTypes.TEXT,
          allowNull: false
      },
      authkey:{
          type: DataTypes.TEXT,
          allowNull: false          
      }
  }, {
    classMethods: {
      associate: function(models) {
          User.belongsTo(models.Employee,{onDelete: 'cascade', hooks: true,foreignKey: 'email' , foreignKeyConstraint:true })
      }
    }
  });
  return User;
};