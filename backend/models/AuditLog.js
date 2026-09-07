const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  screeningId: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  action: {
    type: String,
    enum: [
      'USER_LOGIN', 'USER_LOGOUT', 'DOCUMENT_UPLOADED', 'SCREENING_CREATED', 
      'OCR_REQUESTED', 'AI_ANALYSIS_COMPLETED', 'VALIDATION_COMPLETED', 
      'RISK_SCORE_GENERATED', 'SCREENING_COMPLETED', 'SCREENING_FAILED'
    ]
  },
  status: String,
  metadata: mongoose.Schema.Types.Mixed,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
module.exports = AuditLog;
