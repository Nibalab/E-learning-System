const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  filename: { type: String, required: true },
  path: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

const File = mongoose.model('File', fileSchema);
module.exports = File;
