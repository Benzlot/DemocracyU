// controllers/candidateController.js
const Admin = require('../models/adminModel');
const mongoose = require('mongoose');

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to ' + process.env.MONGODB_URI);
});
mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

async function checkAdmin (req, res) {
  try {
    console.log("run checkAdmin")
    const { mail } = req.body;
    console.log("req.body",req.body)

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'DemocracyU',
    });

      
    let admin = await Admin.findOne({ mail: mail }).lean().exec();

    console.log("res", admin)
    res.status(200).json(admin);
  } catch (error) {
    console.error("error",error)
    res.status(500).json({ error: error.message||'Failed to fetch candidates' });
  } finally {
    if (mongoose.connection.readyState === 1) {
      mongoose.connection.close();
    }
    console.log("end checkAdmin")
  }
};

module.exports = {
    checkAdmin,
}
