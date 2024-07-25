// controllers/candidateController.js
const Admin = require('../models/adminModel');

async function checkAdmin (req, res) {
  try {
    console.log("run checkAdmin")
    const { mail } = req.body;
    console.log("req.body",req.body)

   

      
    let admin = await Admin.findOne({ mail: mail }).lean().exec();

    console.log("res", admin)
    res.status(200).json(admin);
  } catch (error) {
    console.error("error",error)
    res.status(500).json({ error: error.message||'Failed to fetch candidates' });
  } finally {
  
    console.log("end checkAdmin")
  }
};

module.exports = {
    checkAdmin,
}
