'use strict';
module.exports = function(sequelize, DataTypes) {
  var Employee = sequelize.define('Employee', {
      id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER
      },
      name:{
          type:DataTypes.TEXT,
          allowNull: false,
          validate: {
              notEmpty: true,
              is: ["^[a-zA-Z0-9 \-\\\/\#\.]+$", 'i']
          }
      },
      gender:{
        type:DataTypes.TEXT,
        allowNull:false
      },      
      email:{
          type:DataTypes.TEXT,
          allowNull: false
      },      
      doj:{
        type:DataTypes.DATE,
        allowNull:false
      },
      dob:{
        type:DataTypes.DATE,
        allowNull:false
      },
      dol:{
        type:DataTypes.DATE,
        allowNull:true
      }, 
      isdeleted:{
        type:DataTypes.INTEGER,
        allowNull:false
      },      
  }, {
    classMethods: {
      associate: function(models) {
          Employee.hasMany(models.EmployeeAddressBook,{onDelete: 'cascade', hooks: true });
      }
    }
  });
  return Employee;
};