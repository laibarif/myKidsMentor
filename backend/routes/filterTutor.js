const express = require('express');
const router = express.Router();
const { filterTutors } = require('../controller/filterTutorController.js');


router.get('/filter', filterTutors);

module.exports = router;
