const AuditLog = require('../models/AuditLog');

const getAuditLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, screeningId } = req.query;
    const startIndex = (page - 1) * limit;

    const query = {};
    if (screeningId) query.screeningId = screeningId;

    const logs = await AuditLog.find(query)
      .populate('userId', 'name email')
      .sort({ timestamp: -1 })
      .skip(startIndex)
      .limit(parseInt(limit));

    const total = await AuditLog.countDocuments(query);

    res.status(200).json({
      success: true,
      count: logs.length,
      total,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit)
      },
      data: logs
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAuditLogs };
