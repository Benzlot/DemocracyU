// routes/votingRoutes.js
const express = require('express');
const { vote, getVoteResult } = require('../controllers/votingController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/get', getVoteResult);

router.post('/vote', vote);


module.exports = router;
