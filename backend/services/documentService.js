const fs = require('fs');
const Document = require('../models/Document');
const { generateDocumentId } = require('../utils/helpers');

const createDocument = async ({ originalFileName, documentType, filePath, mimeType, fileSize, uploadedBy }) => {
  const document = await Document.create({
    documentId: generateDocumentId(),
    originalFileName,
    documentType,
    filePath,
    mimeType,
    fileSize,
    uploadedBy
  });
  return document;
};

const getDocumentById = async (documentId) => {
  return await Document.findOne({ documentId });
};

const getDocumentsByIds = async (documentIds) => {
  return await Document.find({ _id: { $in: documentIds } });
};

const deleteDocument = async (documentId) => {
  const document = await Document.findOne({ documentId });
  if (document) {
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }
    await Document.deleteOne({ documentId });
    return true;
  }
  return false;
};

module.exports = {
  createDocument,
  getDocumentById,
  getDocumentsByIds,
  deleteDocument
};
