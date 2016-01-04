'use strict';
module.exports = function(sequelize, DataTypes) {
  var CustomerContact = sequelize.define('CustomerContact', {
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
      }
  }, {
    classMethods: {
      associate: function(models) {
          CustomerContact.belongsTo(models.Customer);
          CustomerContact.hasMany(models.CustomerContactAddressBook,{onDelete: 'cascade', hooks: true });
      }
    }
  });
  return CustomerContact;
};