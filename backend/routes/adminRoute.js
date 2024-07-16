const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

// Get user by email
router.get('/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
