// Candidate.js (mongoose model example)
const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  id: Number,
  name: String,
  student_id: String,
  faculty: String,
  major: String,
  vision: String,
  election_name: String,
  img: {
    path: String,
    contentType: String,
  },
});

module.exports = mongoose.model('candidates', candidateSchema);
