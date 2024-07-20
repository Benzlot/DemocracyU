// routes/candidateRoutes.js
const express = require('express');
const { getCandidates, addCandidate, deleteCandidatebyID } = require('../controllers/candidateController');
const router = express.Router();

router.post('/', getCandidates);

router.post('/add', addCandidate)

router.post('/delete', deleteCandidatebyID);

module.exports = router;
