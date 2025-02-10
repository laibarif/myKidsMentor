const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  name: { 
    type: DataTypes.STRING,
    allowNull: false
  },
  email: { 
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: { 
    type: DataTypes.STRING,
    allowNull: false 
  },
  role: { 
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'parent',  // Changed default to 'parent'
    validate: {
      isIn: [['admin', 'tutor', 'parent']]
    }
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
   
  },
  qualifications: DataTypes.JSON,
  subjectsTaught: DataTypes.JSON,
  gradesHandled: DataTypes.JSON,
  teachingExperience: DataTypes.STRING,
  hourlyRates: DataTypes.FLOAT,
  availability: DataTypes.JSON,
  profilePicture: DataTypes.STRING,
  certifications: DataTypes.JSON,
  isVerified: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  },
  city: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  postcode: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  gender: {  // New gender field
    type: DataTypes.STRING,
    allowNull: true,  // Allowing it to be optional
    validate: {
      isIn: [['male', 'female', 'other', 'prefer not to say']]  // Validation to allow only specific values
    }
  },
}, {
  timestamps: true,  // Keep default 'createdAt' and 'updatedAt'
});

// Hash password before saving user
User.beforeCreate(async (user) => {
  if (user.password) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  }

  // Ensure only one admin exists
  if (user.role === 'admin') {
    const adminExists = await User.findOne({ where: { role: 'admin' } });
    if (adminExists) {
      throw new Error('An admin already exists');
    }
    // Set isVerified to true for admins
    user.isVerified = true;
  }
});

module.exports = User;
