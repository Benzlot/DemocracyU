// Candidate.js (mongoose model example)
const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  id : Number,
  name: String,
  student_id: String,
  faculty: String,
  major: String,
  vision: String,
  election_name :String,
});

module.exports = mongoose.model("candidate", CandidateSchema)
