// models/userModel.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  jobTitle: String,
  isAdmin: Boolean, // Assuming you have an isAdmin field to check admin status
  // Add other fields as needed
});

module.exports = mongoose.model('User', UserSchema);
