const { PublicClientApplication } = require('@azure/msal-node');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { getUserById } = require('../models/userModel');

const msalInstance = new PublicClientApplication(config.msalConfig);

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const response = await msalInstance.acquireTokenByUsernamePassword({
      scopes: ["user.read"],
      username,
      password,
    });

    // const user = await getUserById(response.account.homeAccountId);
    // const token = jwt.sign({ userId: user.id, role: user.role }, config.jwtSecret);
    // res.json({ token, user });
    res.json({response})
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed', message : error.message });
  }
};
