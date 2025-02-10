const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');  // Ensure the database connection is properly set up

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,  // Ensure email is unique
    validate: {
      isEmail: true,  // Email validation
    },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  profile_picture: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM('admin'),
    defaultValue: 'admin',
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    onUpdate: Sequelize.NOW,
  },
}, {
  tableName: 'admintable',  // Specify the table name in the database
  timestamps: false,  // Disable automatic timestamps if you want to control them manually
});

module.exports = Admin;
