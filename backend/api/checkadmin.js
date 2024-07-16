// Assuming you have set up your Express server and connected to MongoDB with Mongoose
const express = require('express');
const router = express.Router();
const User = require('./models/User'); // Adjust the path to your User model

// Route to check if a user is admin by email
router.get('/api/checkAdmin', async (req, res) => {
  const { email } = req.query; // Assuming email is passed as a query parameter

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Assuming isAdmin is a boolean field in your schema
    const isAdmin = user.isAdmin;

    res.json({ isAdmin });
  } catch (error) {
    console.error('Error checking admin status:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
