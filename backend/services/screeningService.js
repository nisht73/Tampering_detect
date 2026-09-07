const Screening = require('../models/Screening');
const { generateScreeningId } = require('../utils/helpers');
const documentService = require('./documentService');
const aiService = require('./aiService');
const validationService = require('./validationService');
const riskService = require('./riskService');
const auditService = require('./auditService');
const logger = require('../utils/logger');

const processScreening = async (screeningId) => {
  try {
    const screening = await Screening.findOne({ screeningId }).populate('documentIds');
    if (!screening) throw new Error('Screening not found');

    screening.status = 'PROCESSING';
    await screening.save();

    await auditService.createAuditLog({ screeningId, userId: screening.userId, action: 'OCR_REQUESTED', status: 'SUCCESS' });

    const documentsData = [];
    let combinedOcr = null;
    let combinedTampering = null;
    let combinedFace = null;

    for (const doc of screening.documentIds) {
      const aiResult = await aiService.analyzeDocument(doc.filePath);
      documentsData.push({ doc, ...aiResult });
      
      // Simple aggregation for now
      if (!combinedOcr) combinedOcr = aiResult.ocr;
      if (!combinedTampering || (aiResult.tampering && aiResult.tampering.suspicious)) {
        combinedTampering = aiResult.tampering;
      }
      if (aiResult.face) combinedFace = aiResult.face;
    }

    await auditService.createAuditLog({ screeningId, userId: screening.userId, action: 'AI_ANALYSIS_COMPLETED', status: 'SUCCESS' });

    // Validations
    const docType = screening.documentType || 'passport';
    const validationResult = validationService.validateDocument(combinedOcr, docType);
    
    let expiryStatus = 'UNKNOWN';
    if (combinedOcr && combinedOcr.expiryDate) {
      expiryStatus = validationService.validateExpiry(combinedOcr.expiryDate).status;
    }

    const referenceResult = combinedOcr && combinedOcr.documentNumber 
      ? await validationService.checkReferences(combinedOcr.documentNumber)
      : null;

    let crossValidation = null;
    if (documentsData.length > 1) {
      crossValidation = validationService.crossDocumentValidation(documentsData);
    }

    await auditService.createAuditLog({ screeningId, userId: screening.userId, action: 'VALIDATION_COMPLETED', status: 'SUCCESS' });

    // Risk Calculation
    const riskResult = riskService.calculateRisk({
      validationResult,
      tamperingResult: combinedTampering,
      faceResult: combinedFace,
      referenceResult,
      expiryStatus
    });

    await auditService.createAuditLog({ screeningId, userId: screening.userId, action: 'RISK_SCORE_GENERATED', status: 'SUCCESS' });

    screening.ocrResult = combinedOcr;
    screening.tamperingResult = combinedTampering;
    screening.faceResult = combinedFace;
    screening.validationResult = { ...validationResult, crossValidation, expiryStatus, referenceResult };
    screening.riskResult = riskResult;
    
    if (riskResult.level === 'CRITICAL' || riskResult.level === 'HIGH') {
      screening.status = 'REVIEW_REQUIRED';
    } else {
      screening.status = 'COMPLETED';
    }
    
    screening.completedAt = new Date();
    await screening.save();

    await auditService.createAuditLog({ screeningId, userId: screening.userId, action: 'SCREENING_COMPLETED', status: 'SUCCESS' });
    
    return screening;

  } catch (error) {
    logger.error(`Screening ${screeningId} failed: ${error.message}`);
    const screening = await Screening.findOne({ screeningId });
    if (screening) {
      screening.status = 'FAILED';
      await screening.save();
      await auditService.createAuditLog({ screeningId, userId: screening.userId, action: 'SCREENING_FAILED', status: 'FAILED', metadata: { error: error.message } });
    }
    throw error;
  }
};

const createScreening = async ({ documentIds, faceImageId, userId, documentType }) => {
  const screening = await Screening.create({
    screeningId: generateScreeningId(),
    userId,
    documentIds,
    faceImageId,
    documentType
  });

  await auditService.createAuditLog({ screeningId: screening.screeningId, userId, action: 'SCREENING_CREATED', status: 'SUCCESS' });

  // Trigger processing asynchronously
  processScreening(screening.screeningId).catch(err => logger.error('Async screening failed: ' + err.message));

  return screening;
};

module.exports = {
  createScreening,
  processScreening
};
