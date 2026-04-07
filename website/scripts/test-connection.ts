import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

async function testConnection() {
  console.log('Testing MongoDB connection...');
  console.log('URI:', MONGODB_URI.substring(0, 50) + '...');

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('Successfully connected to MongoDB');
    console.log('Database name:', mongoose.connection.db?.databaseName);
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error: unknown) {
    const details =
      error && typeof error === 'object'
        ? (error as { message?: string; code?: string | number; name?: string })
        : {};

    console.error('MongoDB connection failed:');
    console.error('Error:', details.message || 'Unknown error');
    console.error('Code:', details.code || 'N/A');
    console.error('Name:', details.name || 'Unknown');
  }
}

void testConnection();
