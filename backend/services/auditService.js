const AuditLog = require('../models/AuditLog');
const logger = require('../utils/logger');

const createAuditLog = async (data) => {
  try {
    const auditLog = await AuditLog.create(data);
    return auditLog;
  } catch (error) {
    logger.error(`Failed to create audit log: ${error.message}`);
    // Don't throw, we don't want audit failures to break main workflows
  }
};

module.exports = {
  createAuditLog
};
