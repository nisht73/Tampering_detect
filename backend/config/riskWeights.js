const riskWeights = {
  tamperingDetected: 30,
  faceMismatch: 25,
  documentExpired: 20,
  fieldMismatch: 15,
  blacklisted: 40,
  expiringDocuments: 5,
  missingFields: 10
};

const riskThresholds = {
  LOW: { min: 0, max: 25, level: 'LOW' },
  MEDIUM: { min: 26, max: 50, level: 'MEDIUM' },
  HIGH: { min: 51, max: 75, level: 'HIGH' },
  CRITICAL: { min: 76, max: 100, level: 'CRITICAL' }
};

const getRiskLevel = (score) => {
  if (score >= riskThresholds.CRITICAL.min) return riskThresholds.CRITICAL.level;
  if (score >= riskThresholds.HIGH.min) return riskThresholds.HIGH.level;
  if (score >= riskThresholds.MEDIUM.min) return riskThresholds.MEDIUM.level;
  return riskThresholds.LOW.level;
};

module.exports = {
  riskWeights,
  riskThresholds,
  getRiskLevel
};
