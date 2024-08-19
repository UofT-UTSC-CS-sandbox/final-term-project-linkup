const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  uploader_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User schema
  file_path: String,
  public: Boolean,
  num_swipes: Number
}, { collection: 'resumes' });

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;