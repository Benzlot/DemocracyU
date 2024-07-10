const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  name: String,
  email: String,
  jobTitle: String,
  // Add other fields as needed
});

module.exports = mongoose.model('Admin', AdminSchema);
