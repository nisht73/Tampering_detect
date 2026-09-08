const mongoose = require('mongoose');

const screeningSchema = new mongoose.Schema({
  screeningId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  documentIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  faceImageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  },
  status: {
    type: String,
    enum: ['UPLOADED', 'PROCESSING', 'COMPLETED', 'FAILED', 'REVIEW_REQUIRED'],
    default: 'UPLOADED'
  },
  documentType: String,
  ocrResult: mongoose.Schema.Types.Mixed,
  validationResult: mongoose.Schema.Types.Mixed,
  tamperingResult: mongoose.Schema.Types.Mixed,
  faceResult: mongoose.Schema.Types.Mixed,
  riskResult: mongoose.Schema.Types.Mixed,
  documentResults: mongoose.Schema.Types.Mixed,
  completedAt: Date
}, {
  timestamps: true
});

const Screening = mongoose.model('Screening', screeningSchema);
module.exports = Screening;
