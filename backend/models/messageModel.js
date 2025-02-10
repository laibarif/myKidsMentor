const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const MessageModel = sequelize.define("Message", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  senderPhoneNumber: {
    type: DataTypes.STRING(15), 
    allowNull: false, 
  },
  receiverPhoneNumber: {
    type: DataTypes.STRING(15), 
    allowNull: false, 
  }
});

module.exports = MessageModel;
