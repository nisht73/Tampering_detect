const crypto = require('crypto');
const path = require('path');

const generateRandomChars = (length = 6) => {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length).toUpperCase();
};

const generateDocumentId = () => {
  return `DOC-${generateRandomChars()}`;
};

const generateScreeningId = () => {
  return `SCR-${generateRandomChars()}`;
};

const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString();
};

const sanitizeFilename = (filename) => {
  const ext = path.extname(filename);
  const name = path.basename(filename, ext);
  return `${name.replace(/[^a-zA-Z0-9_-]/g, '')}${ext}`;
};

module.exports = {
  generateDocumentId,
  generateScreeningId,
  formatDate,
  sanitizeFilename
};
