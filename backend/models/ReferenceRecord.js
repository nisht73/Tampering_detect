const mongoose = require('mongoose');

const referenceRecordSchema = new mongoose.Schema({
  documentNumber: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  status: {
    type: String,
    enum: ['BLACKLISTED', 'WATCHLIST', 'CLEAR'],
    default: 'CLEAR'
  },
  reason: String,
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const ReferenceRecord = mongoose.model('ReferenceRecord', referenceRecordSchema);
module.exports = ReferenceRecord;
