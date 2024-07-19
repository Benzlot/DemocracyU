// models/userModel.js
const mongoose = require('mongoose');

const ElectionSchema = new mongoose.Schema({
  election_name: String,
  election_type: String,
  election_start: String,
  election_end: String,
  voter_table: String,
  voteResult_table : String,
  candidate_table: String,
});

module.exports = mongoose.model('elections', ElectionSchema);
