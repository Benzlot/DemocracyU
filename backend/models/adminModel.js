const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  student_id: String,
  name: String,
  faculty: String,
  branch: String,
  mail: String,
  // Add other fields as needed
});

module.exports = mongoose.model('admins', AdminSchema);
