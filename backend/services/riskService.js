const { riskWeights, getRiskLevel } = require('../config/riskWeights');

const calculateRisk = ({ validationResult, tamperingResult, faceResult, referenceResult, expiryStatus }) => {
  let score = 0;
  const factors = [];

  if (tamperingResult && tamperingResult.suspicious === true) {
    score += riskWeights.tamperingDetected;
    factors.push({ reason: 'Tampering detected', weight: riskWeights.tamperingDetected });
  }

  if (faceResult && (faceResult.matched === false || faceResult.similarity < 0.7)) {
    score += riskWeights.faceMismatch;
    factors.push({ reason: 'Face mismatch', weight: riskWeights.faceMismatch });
  }

  if (expiryStatus === 'EXPIRED') {
    score += riskWeights.documentExpired;
    factors.push({ reason: 'Document expired', weight: riskWeights.documentExpired });
  }

  if (expiryStatus === 'EXPIRING_SOON') {
    score += riskWeights.expiringDocuments;
    factors.push({ reason: 'Document expiring soon', weight: riskWeights.expiringDocuments });
  }

  if (validationResult && validationResult.errors && validationResult.errors.length > 0) {
    const errorCount = Math.min(validationResult.errors.length, 3); // cap at 3
    const weight = errorCount * riskWeights.missingFields;
    score += weight;
    factors.push({ reason: `Validation errors (${errorCount})`, weight });
  }

  if (referenceResult && referenceResult.status === 'BLACKLISTED') {
    score += riskWeights.blacklisted;
    factors.push({ reason: 'Document is blacklisted', weight: riskWeights.blacklisted });
  }

  score = Math.min(score, 100);
  const level = getRiskLevel(score);

  return {
    score,
    level,
    factors
  };
};

module.exports = { calculateRisk };
