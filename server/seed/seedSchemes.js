const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');
const Scheme = require('../models/Scheme');
const path = require('path');
const schemesData = require('./data.json');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing schemes
    await Scheme.deleteMany({});
    console.log('🗑️  Cleared existing schemes');

    // Insert schemes from the JSON file
    await Scheme.insertMany(schemesData);
    console.log(`✅ Seeded ${schemesData.length} government schemes from data.json`);

    // Create admin if not exists
    const existingAdmin = await Admin.findOne({ username: process.env.ADMIN_USERNAME || 'admin' });
    if (!existingAdmin) {
      await Admin.create({
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'admin123',
      });
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    console.log('\n🎉 Database seeded successfully with diverse domains!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
