import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { createAuditLog } from '@/lib/audit-log';
import Admin from '@/models/Admin';
import { requireSuperAdminSession } from '@/lib/admin-auth';
import { assertRateLimit, buildRateLimitKey, getClientIp } from '@/lib/rate-limit';

export async function GET() {
  try {
    const session = await requireSuperAdminSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const admins = await Admin.find()
      .sort({ createdAt: -1 })
      .select('_id name email role createdAt');

    return NextResponse.json({
      admins,
      currentUserEmail: session.user.email,
      currentUserRole: session.user.role,
    });
  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admins' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireSuperAdminSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, password, role } = body;
    const ipAddress = getClientIp(request.headers);

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const requestedRole = role === 'super-admin' ? 'super-admin' : 'admin';
    const rateLimitKey = buildRateLimitKey('admin-users-create', normalizedEmail, ipAddress);
    const rateLimitResult = assertRateLimit(rateLimitKey, 3, 5 * 60 * 1000);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many admin creation attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (String(password).length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    await connectDB();

    const existingAdmin = await Admin.findOne({ email: normalizedEmail });
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'An admin with this email already exists' },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const newAdmin = await Admin.create({
      name: name || normalizedEmail,
      email: normalizedEmail,
      passwordHash,
      role: requestedRole,
    });

    await createAuditLog({
      actorEmail: session.user.email,
      actorRole: session.user.role as 'admin' | 'super-admin',
      action: 'admin.create',
      entityType: 'admin-user',
      entityId: newAdmin._id.toString(),
      entityLabel: newAdmin.email,
      details: {
        createdRole: newAdmin.role,
      },
    });

    return NextResponse.json(
      {
        message: 'Admin account created successfully',
        admin: {
          id: newAdmin._id.toString(),
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role,
          createdAt: newAdmin.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}
