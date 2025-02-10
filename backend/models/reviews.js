const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.js'); // Adjust path as needed
const User = require('../models/user.js'); // Ensure this is the correct import path

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tutor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    field: 'created_at', 
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    field: 'updated_at', 
  },
}, {
  timestamps: false, 
});

Review.belongsTo(User, {
  foreignKey: 'parent_id',
  as: 'parent', 
});

module.exports = Review;
