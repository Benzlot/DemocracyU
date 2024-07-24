// controllers/candidateController.js
const Admin = require('../models/adminModel');
const mongoose = require('mongoose');

async function checkAdmin (req, res) {
  try {
    const { mail } = req.body;

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'DemocracyU',
    });
    console.log('MongoDB connected');
      
    let admin = await Admin.findOne({ mail: mail }).lean().exec();



    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message||'Failed to fetch candidates' });
  } finally {
    mongoose.connection.close();
  }
};

module.exports = {
    checkAdmin,
}
