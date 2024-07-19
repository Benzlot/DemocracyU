// routes/candidateRoutes.js
const express = require('express');
const { getElection, addElection, updateElection,deleteElection, getElectionbyName } = require('../controllers/electionController');
const router = express.Router();

router.get('/', getElection);

router.post('/getbyName', getElectionbyName)

router.post('/add', addElection)

router.post('/update', updateElection)

router.post('/delete', deleteElection)

module.exports = router;
