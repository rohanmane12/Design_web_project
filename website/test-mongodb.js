/* eslint-disable @typescript-eslint/no-require-imports */
// Quick MongoDB connection test
// dotenv is loaded automatically by Next.js, but for this test we'll read manually
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const match = line.match(/^([^=]+)=(.+)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        // Remove surrounding quotes
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔍 Testing MongoDB connection...');
console.log('URI (first 60 chars):', MONGODB_URI ? MONGODB_URI.substring(0, 60) + '...' : 'NOT DEFINED');

// Test DNS resolution for MongoDB Atlas
const dns = require('dns');

console.log('\n🌐 Testing DNS resolution for MongoDB Atlas...');
dns.resolveSrv('_mongodb._tcp.cluster0.jub9cxh.mongodb.net', (err, addresses) => {
  if (err) {
    console.error('❌ DNS SRV resolution failed:', err.message);
    console.log('\n💡 This usually means:');
    console.log('   1. Your network/firewall is blocking DNS queries');
    console.log('   2. Your ISP does not support SRV record lookups');
    console.log('   3. MongoDB Atlas is temporarily unreachable');
    console.log('\n🔧 Possible solutions:');
    console.log('   - Try using a standard MongoDB connection string (non-SRV)');
    console.log('   - Check if you can access https://cloud.mongodb.com in your browser');
    console.log('   - Try switching to a different network (e.g., mobile hotspot)');
    return;
  }
  console.log('✅ DNS resolution succeeded');
  console.log('Addresses:', addresses);
});

// Test with mongoose
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('\n📡 Attempting direct MongoDB connection (timeout: 10s)...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4
    });
    console.log('✅ MongoDB connection successful!');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\n💡 Common causes for ECONNREFUSED:');
    console.log('   1. Network/firewall blocking MongoDB Atlas access');
    console.log('   2. MongoDB Atlas IP whitelist does not include your IP');
    console.log('   3. DNS resolution issues (see above)');
    console.log('\n🔧 Try these steps:');
    console.log('   1. Go to https://cloud.mongodb.com');
    console.log('   2. Navigate to Network Access');
    console.log('   3. Add your current IP address or use 0.0.0.0/0 (allow all)');
  } finally {
    process.exit(0);
  }
}

testConnection();
