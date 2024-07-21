// Candidate.js (mongoose model example)
const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: String,
  student_id: { type: String, unique: true },
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
