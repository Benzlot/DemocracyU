// routes/candidateRoutes.js
const express = require('express');
const { getCandidates, addCandidate } = require('../controllers/candidateController');
const router = express.Router();

router.get('/', getCandidates);

router.post('/add', addCandidate)

module.exports = router;
