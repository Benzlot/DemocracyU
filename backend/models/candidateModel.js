// Candidate.js (mongoose model example)
const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  id: String,
  name: String,
  student_id: String,
  faculty: String,
  major: String,
  vision: String,
  election_name :String,
});

module.exports = mongoose.model("candidate", CandidateSchema)
