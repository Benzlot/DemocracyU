// routes/candidateRoutes.js
const express = require('express');
const { getVoter, addVoter, deleteVoterbyID, getVoterByMail, getVoterStatus } = require('../controllers/voterController');
const router = express.Router();

router.post('/get', getVoter);

router.post('/add', addVoter);

router.post('/delete', deleteVoterbyID);

router.post('/getByMail',getVoterByMail)

router.post('/getStatus', getVoterStatus)

module.exports = router;
