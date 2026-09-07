const ReferenceRecord = require('../models/ReferenceRecord');

const validateDocument = (ocrResult, documentType) => {
  const errors = [];
  const requiredFields = ['name', 'documentNumber', 'dateOfBirth', 'expiryDate'];
  
  if (!ocrResult) {
    return { valid: false, errors: ['No OCR data found'] };
  }

  requiredFields.forEach(field => {
    if (!ocrResult[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
};

const validateExpiry = (expiryDate) => {
  if (!expiryDate) return { status: 'UNKNOWN' };
  
  const expiry = new Date(expiryDate);
  const now = new Date();
  
  if (isNaN(expiry.getTime())) return { status: 'UNKNOWN' };

  if (expiry < now) {
    return { status: 'EXPIRED' };
  }

  const ninetyDaysFromNow = new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000));
  if (expiry <= ninetyDaysFromNow) {
    return { status: 'EXPIRING_SOON' };
  }

  return { status: 'VALID' };
};

const crossDocumentValidation = (documentsData) => {
  const matches = [];
  const mismatches = [];
  
  if (!documentsData || documentsData.length < 2) {
    return { matches, mismatches };
  }

  // Simple comparison between first two docs
  const doc1 = documentsData[0].ocr;
  const doc2 = documentsData[1].ocr;
  
  if (!doc1 || !doc2) return { matches, mismatches };

  const fieldsToCompare = ['name', 'dateOfBirth'];
  
  fieldsToCompare.forEach(field => {
    if (doc1[field] && doc2[field]) {
      // Basic normalization
      const val1 = String(doc1[field]).toLowerCase().trim();
      const val2 = String(doc2[field]).toLowerCase().trim();
      
      if (val1 === val2) {
        matches.push(field);
      } else {
        mismatches.push({
          field,
          doc1Value: doc1[field],
          doc2Value: doc2[field],
          status: 'MISMATCH'
        });
      }
    }
  });

  return { matches, mismatches };
};

const checkReferences = async (documentNumber) => {
  if (!documentNumber) return null;
  
  const record = await ReferenceRecord.findOne({ documentNumber });
  if (record) {
    return {
      found: true,
      status: record.status,
      reason: record.reason
    };
  }
  return { found: false, status: 'CLEAR' };
};

module.exports = {
  validateDocument,
  validateExpiry,
  crossDocumentValidation,
  checkReferences
};
