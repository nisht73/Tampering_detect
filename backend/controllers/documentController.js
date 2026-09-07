const documentService = require('../services/documentService');
const auditService = require('../services/auditService');

const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const { documentType } = req.body;
    if (!documentType) {
      return res.status(400).json({ success: false, message: 'Document type is required' });
    }

    const document = await documentService.createDocument({
      originalFileName: req.file.originalname,
      documentType,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedBy: req.user._id
    });

    await auditService.createAuditLog({
      userId: req.user._id,
      action: 'DOCUMENT_UPLOADED',
      status: 'SUCCESS',
      metadata: { documentId: document.documentId }
    });

    res.status(201).json({
      success: true,
      data: document
    });
  } catch (error) {
    next(error);
  }
};

const getDocument = async (req, res, next) => {
  try {
    const document = await documentService.getDocumentById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    next(error);
  }
};

const deleteDocument = async (req, res, next) => {
  try {
    const deleted = await documentService.deleteDocument(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
  getDocument,
  deleteDocument
};
