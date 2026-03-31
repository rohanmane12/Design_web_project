import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Enquiry from '@/models/Enquiry';
import { requireAdminSession } from '@/lib/admin-auth';

export async function GET() {
  try {
    const session = await requireAdminSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const enquiries = await Enquiry.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email phone productName status createdAt');

    return NextResponse.json(enquiries);
  } catch (error) {
    console.error('Error fetching recent enquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enquiries' },
      { status: 500 }
    );
  }
}
