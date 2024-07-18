// models/userModel.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  student_id: String,
  name: String,
  faculty: String,
  branch: String,
  mail: String,
});

module.exports = mongoose.model('User', UserSchema);
