const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  documentId: {
    type: String,
    required: true,
    unique: true
  },
  originalFileName: {
    type: String,
    required: true
  },
  documentType: {
    type: String,
    enum: ['passport', 'visa', 'national_id', 'driving_licence', 'permit'],
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Document = mongoose.model('Document', documentSchema);
module.exports = Document;
