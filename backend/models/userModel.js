const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  jobTitle: String,
  // Add other fields as needed
});

module.exports = mongoose.model('User', UserSchema);
