import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import Admin from '@/models/Admin';
import { requireAdminSession } from '@/lib/admin-auth';
import { assertRateLimit, buildRateLimitKey, getClientIp } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;
    const ipAddress = getClientIp(request.headers);

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Password strength validation (min 6 characters)
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const rateLimitKey = buildRateLimitKey('admin-signup', email, ipAddress);
    const rateLimitResult = assertRateLimit(rateLimitKey, 3, 5 * 60 * 1000);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many signup attempts. Please try again later.' },
        { status: 429 }
      );
    }

    await connectDB();

    const adminCount = await Admin.countDocuments();
    const session = await requireAdminSession();

    if (adminCount > 0 && !session?.user?.email) {
      return NextResponse.json(
        { error: 'Admin signup is disabled. Please sign in as an existing admin.' },
        { status: 403 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'An admin with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create new admin
    const newAdmin = await Admin.create({
      email: email.toLowerCase(),
      passwordHash,
      name: name || email,
      role: 'admin'
    });

    return NextResponse.json(
      {
        message: 'Admin account created successfully',
        admin: {
          id: newAdmin._id.toString(),
          email: newAdmin.email,
          role: newAdmin.role
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Check if it's a database connection error
    if (
      errorMessage.includes('querySrv') ||
      errorMessage.includes('ECONNREFUSED') ||
      errorMessage.includes('ENOTFOUND') ||
      errorMessage.includes('MongoServerError') ||
      errorMessage.includes('MongoServerSelectionError')
    ) {
      return NextResponse.json(
        { error: 'Database connection error. Please try again later.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'An error occurred while creating the account' },
      { status: 500 }
    );
  }
}
