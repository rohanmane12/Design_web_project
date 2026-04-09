import { NextResponse } from 'next/server';
import { createAuditLog } from '@/lib/audit-log';
import { connectDB } from '@/lib/db';
import Admin from '@/models/Admin';
import { requireSuperAdminSession } from '@/lib/admin-auth';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSuperAdminSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;

    const adminToDelete = await Admin.findById(id);

    if (!adminToDelete) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    if (adminToDelete.email === session.user.email) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 400 }
      );
    }

    const totalAdmins = await Admin.countDocuments();
    if (totalAdmins <= 1) {
      return NextResponse.json(
        { error: 'At least one admin account must remain' },
        { status: 400 }
      );
    }

    await Admin.findByIdAndDelete(id);

    await createAuditLog({
      actorEmail: session.user.email,
      actorRole: session.user.role as 'admin' | 'super-admin',
      action: 'admin.delete',
      entityType: 'admin-user',
      entityId: adminToDelete._id.toString(),
      entityLabel: adminToDelete.email,
      details: {
        deletedRole: adminToDelete.role,
      },
    });

    return NextResponse.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin user:', error);
    return NextResponse.json(
      { error: 'Failed to delete admin user' },
      { status: 500 }
    );
  }
}
