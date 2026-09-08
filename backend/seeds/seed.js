require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const ReferenceRecord = require('../models/ReferenceRecord');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/document-screening');
    logger.info('MongoDB Connected for Seeding');
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing
    await User.deleteMany();
    await ReferenceRecord.deleteMany();

    // Create users
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@docscreen.com',
      passwordHash: 'admin123',
      role: 'ADMIN'
    });

    const officer = await User.create({
      name: 'Officer',
      email: 'officer@docscreen.com',
      passwordHash: 'officer123',
      role: 'OFFICER'
    });

    logger.info('Users seeded successfully');

    // Create reference records
    await ReferenceRecord.create([
      {
        documentNumber: 'BLK123456',
        name: 'John Blacklist',
        status: 'BLACKLISTED',
        reason: 'Known fraudulent document',
        addedBy: admin._id
      },
      {
        documentNumber: 'WAT123456',
        name: 'Jane Watchlist',
        status: 'WATCHLIST',
        reason: 'Suspicious activity previously noted',
        addedBy: officer._id
      },
      {
        documentNumber: 'CLR123456',
        name: 'Bob Clear',
        status: 'CLEAR',
        reason: 'Verified citizen',
        addedBy: admin._id
      }
    ]);

    logger.info('Reference records seeded successfully');

    process.exit();
  } catch (error) {
    logger.error(`Seed error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
