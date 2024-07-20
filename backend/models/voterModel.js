// models/userModel.js
const mongoose = require('mongoose');

const VoterSchema = new mongoose.Schema({
  name: String,
  student_id: String,
  mail: String,
  faculty: String,
  major: String,
  election_name :String,
  status : String,
});

module.exports = mongoose.model("voters", VoterSchema)
