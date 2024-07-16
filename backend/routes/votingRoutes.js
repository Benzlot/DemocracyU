// routes/votingRoutes.js
const express = require('express');
const { getVotes, vote } = require('../controllers/votingController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/votes', verifyToken, getVotes);
router.post('/vote', verifyToken, vote);

module.exports = router;
