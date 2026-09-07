const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  const MAX_RETRIES = 5;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      logger.info(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      retries++;
      logger.error(`MongoDB Connection Error: ${error.message}. Retrying... (${retries}/${MAX_RETRIES})`);
      if (retries === MAX_RETRIES) {
        logger.error('Could not connect to MongoDB after maximum retries. Exiting...');
        process.exit(1);
      }
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};

module.exports = connectDB;
