const screeningService = require('../services/screeningService');
const Screening = require('../models/Screening');

const createScreening = async (req, res, next) => {
  try {
    const { documentIds, faceImageId, documentType } = req.body;

    if (!documentIds || !Array.isArray(documentIds) || documentIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Document IDs are required' });
    }

    const screening = await screeningService.createScreening({
      documentIds,
      faceImageId,
      userId: req.user._id,
      documentType
    });

    res.status(201).json({
      success: true,
      data: {
        screeningId: screening.screeningId,
        status: screening.status
      }
    });
  } catch (error) {
    next(error);
  }
};

const getScreenings = async (req, res, next) => {
  try {
    const { status, riskLevel, documentType, search, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (req.user.role !== 'ADMIN') {
      query.userId = req.user._id;
    }

    if (status) query.status = status;
    if (riskLevel) query['riskResult.level'] = riskLevel;
    if (documentType) query.documentType = documentType;
    if (search) query.screeningId = { $regex: search, $options: 'i' };

    const startIndex = (page - 1) * limit;

    const screenings = await Screening.find(query)
      .populate('documentIds', 'documentId originalFileName documentType')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(parseInt(limit));

    const total = await Screening.countDocuments(query);

    res.status(200).json({
      success: true,
      count: screenings.length,
      total,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit)
      },
      data: screenings
    });
  } catch (error) {
    next(error);
  }
};

const getScreening = async (req, res, next) => {
  try {
    const screening = await Screening.findOne({ screeningId: req.params.id })
      .populate('documentIds')
      .populate('faceImageId')
      .populate('userId', 'name email role');

    if (!screening) {
      return res.status(404).json({ success: false, message: 'Screening not found' });
    }

    if (req.user.role !== 'ADMIN' && screening.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this screening' });
    }

    res.status(200).json({
      success: true,
      data: screening
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createScreening,
  getScreenings,
  getScreening
};
