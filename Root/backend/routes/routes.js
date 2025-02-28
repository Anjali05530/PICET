const express = require('express');
const { register } = require('../controllers/controller.js');

const router = express.Router();

// Register Route
router.post('/register', register);

module.exports = router;