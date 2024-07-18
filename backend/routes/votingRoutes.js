// routes/votingRoutes.js
const express = require('express');
const { vote } = require('../controllers/votingController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

// router.get('/votes', verifyToken, getVotes);
// router.post('/vote', verifyToken, vote);
router.post('/vote', vote);

module.exports = router;
