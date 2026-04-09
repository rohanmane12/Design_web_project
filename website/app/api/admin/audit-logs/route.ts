import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import AuditLog from '@/models/AuditLog';
import { requireSuperAdminSession } from '@/lib/admin-auth';

export async function GET() {
  try {
    const session = await requireSuperAdminSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const logs = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}
