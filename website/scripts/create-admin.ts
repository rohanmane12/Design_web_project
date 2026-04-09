import bcrypt from 'bcryptjs';
import dns from 'node:dns';
import mongoose from 'mongoose';
import { loadEnvConfig } from '@next/env';
import Admin from '../models/Admin';

loadEnvConfig(process.cwd());
dns.setServers(['8.8.8.8', '1.1.1.1']);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is not defined');
  process.exit(1);
}

async function createAdmin() {
  try {
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI is not defined');
      process.exit(1);
    }
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI as string);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@designconcept.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin already exists. Skipping creation.');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Create admin password
    const plainPassword = 'Admin@123';
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    // Create admin user
    await Admin.create({
      email: 'admin@designconcept.com',
      passwordHash,
      role: 'super-admin'
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@designconcept.com');
    console.log('🔑 Password: Admin@123');
    console.log('\n⚠️  Please change the password after first login!');

    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
