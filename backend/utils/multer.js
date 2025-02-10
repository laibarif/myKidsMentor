const multer = require('multer');

// Multer storage setup
const storage = multer.diskStorage({}); // Using default storage

// Multer middleware
const upload = multer({ storage });

module.exports = upload;
