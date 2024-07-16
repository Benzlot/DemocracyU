// controllers/authController.js
const { PublicClientApplication } = require('@azure/msal-node');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/userModel');

const msalInstance = new PublicClientApplication(config.msalConfig);

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const response = await msalInstance.acquireTokenByUsernamePassword({
      scopes: ["user.read"],
      username,
      password,
    });

    const user = await User.findOne({ email: username });
    const token = jwt.sign({ userId: user.id, role: user.role }, config.jwtSecret);
    res.json({ token, user });
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed', message: error.message });
  }
};

// Check if a user is admin by email
exports.checkAdmin = async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isAdmin = user.isAdmin;
    res.json({ isAdmin });
  } catch (error) {
    console.error('Error checking admin status:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
