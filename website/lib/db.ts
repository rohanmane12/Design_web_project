import dns from 'node:dns';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const PUBLIC_DNS_SERVERS = ['8.8.8.8', '1.1.1.1'];

dns.setServers(PUBLIC_DNS_SERVERS);

if (!MONGODB_URI) {
  console.warn('⚠️ MONGODB_URI is not defined. Database features will be disabled.');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }

  console.log('🔍 Using MongoDB URI:', MONGODB_URI.substring(0, 50) + '...');

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      // Add these options to help with connection issues
      family: 4, // Force IPv4 instead of IPv6
      // Try to work around DNS SRV issues
      appName: 'design-concept-app'
    }).then((mongoose) => {
      console.log('✅ Connected to MongoDB');
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB connection error:', error.message);
      console.log('💡 If you see ECONNREFUSED, try:');
      console.log('   1. Use a standard mongodb:// connection string instead of mongodb+srv://');
      console.log('   2. Check MongoDB Atlas Network Access settings');
      console.log('   3. Try a different network (your network may block SRV DNS queries)');
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
