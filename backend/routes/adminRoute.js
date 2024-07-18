const express = require('express');
const router = express.Router();
const { checkAdmin } = require('../controllers/authController.js')

// Get user by email
router.post('/checkAdmin', checkAdmin);

module.exports = router;
