// Candidate.js (mongoose model example)
const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  id: String,
  name: String,
  student_id: String,
  faculty: String,
  branch: String,
  vision: String,
  // Add other fields as needed
});

module.exports = mongoose.model('Candidate', CandidateSchema);
