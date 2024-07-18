// Candidate.js (mongoose model example)
const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
  index: mongoose.Schema.Types.Decimal128,
  candidate_id: String,
  hashed_data: String,
  previous_hash: String,
  nonce: String
  // Add other fields as needed
});

module.exports = mongoose.model('vote', VoteSchema);
