const Screening = require('../models/Screening');

const getStats = async (req, res, next) => {
  try {
    const totalScreenings = await Screening.countDocuments();
    
    const statusCounts = await Screening.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    let pendingCount = 0;
    statusCounts.forEach(stat => {
      if (['UPLOADED', 'PROCESSING'].includes(stat._id)) {
        pendingCount += stat.count;
      }
    });

    const riskCounts = await Screening.aggregate([
      { $group: { _id: '$riskResult.level', count: { $sum: 1 } } }
    ]);

    const recentScreenings = await Screening.find()
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        total: totalScreenings,
        pending: pendingCount,
        byStatus: statusCounts,
        byRiskLevel: riskCounts,
        recent: recentScreenings
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats };
