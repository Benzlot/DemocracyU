const jwt = require('jsonwebtoken');
const config = require('../config');

exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'No token provided' });

  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) return res.status(500).json({ error: 'Failed to authenticate token' });
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  if (req.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Not authorized' });
  }
};
