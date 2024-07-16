// routes/authRoutes.js
const express = require('express');
const { login, checkAdmin } = require('../controllers/authController');
const router = express.Router();

router.post('/login', login);
router.get('/check-admin', checkAdmin);

module.exports = router;
