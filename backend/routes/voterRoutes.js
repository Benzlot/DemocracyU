// routes/candidateRoutes.js
const express = require('express');
const { getVoter, addVoter, deleteVoterbyID } = require('../controllers/voterController');
const router = express.Router();

router.post('/get', getVoter);

router.post('/add', addVoter);

router.post('/delete', deleteVoterbyID);

module.exports = router;
