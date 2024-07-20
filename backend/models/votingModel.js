// Candidate.js (mongoose model example)
const mongoose = require('mongoose');

const VoteResultSchema = new mongoose.Schema({
  index: Number,
  candidate_id: String,
  election_name: String,
  hashed_data: String,
  previous_hash: String,
  nonce: String,
  hash: String
}, { timestamps: true });

module.exports = mongoose.model("voteresult", VoteResultSchema)
