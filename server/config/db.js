const mongoose = require('mongoose');
const dns = require('dns');

// Force Node.js to use Google's DNS (8.8.8.8) instead of ISP/system DNS
// This bypasses ISP-level blocks on MongoDB Atlas SRV records
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4, // Force IPv4
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️  MongoDB not available: ${error.message}`);
    console.log('🔶 Running in offline mode — admin login still works via .env credentials');
    // Do NOT exit — server continues to run without DB
  }
};

module.exports = connectDB;
