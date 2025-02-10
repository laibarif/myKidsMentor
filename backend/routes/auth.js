const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controller/authController.js');
const upload = require('../config/multerConfig.js');

// Use multer for file uploads
router.post('/register', upload.fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "certifications", maxCount: 10 }, // Allow multiple certification files
]), registerUser);

// Login user
router.post('/login', loginUser);

module.exports = router;
