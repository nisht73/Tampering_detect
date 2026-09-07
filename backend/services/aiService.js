const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const logger = require('../utils/logger');

const analyzeDocument = async (filePath) => {
  if (process.env.USE_MOCK_AI === 'true') {
    logger.info('Using mock AI service response');
    return {
      ocr: { name: 'John Doe', documentNumber: '12345678', dateOfBirth: '1990-01-01', expiryDate: '2030-01-01' },
      tampering: { suspicious: false, confidence: 0.95 },
      face: { matched: true, similarity: 0.98 }
    };
  }

  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    const response = await axios.post(`${process.env.AI_SERVICE_URL}/analyze`, form, {
      headers: {
        ...form.getHeaders()
      },
      timeout: 30000 // 30 seconds
    });

    return response.data;
  } catch (error) {
    logger.error(`AI Service Error: ${error.message}`);
    throw new Error('AI analysis failed: ' + error.message);
  }
};

module.exports = {
  analyzeDocument
};
