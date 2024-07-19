// routes/candidateRoutes.js
const express = require('express');
const { getVoter, addVoter } = require('../controllers/voterController');
const router = express.Router();

router.post('/get', getVoter);

router.post('/add', addVoter);

module.exports = router;
