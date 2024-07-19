// models/userModel.js
const mongoose = require('mongoose');

const VoterSchema = new mongoose.Schema({
  mail: String,
  student_id: String,
  name: String,
  faculty: String,
  branch: String,
  status : String,
});

module.exports = (table_name) =>{return mongoose.model(table_name, VoterSchema);}
