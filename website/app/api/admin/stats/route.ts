import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import Portfolio from '@/models/Portfolio';
import Enquiry from '@/models/Enquiry';
import { requireAdminSession } from '@/lib/admin-auth';

export async function GET() {
  try {
    const session = await requireAdminSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const [totalServices, totalPortfolio, totalEnquiries] = await Promise.all([
      Product.countDocuments(),
      Portfolio.countDocuments(),
      Enquiry.countDocuments(),
    ]);

    const pendingEnquiries = await Enquiry.countDocuments({ status: 'pending' });
    const completedEnquiries = await Enquiry.countDocuments({ status: 'completed' });

    return NextResponse.json({
      totalServices,
      totalPortfolio,
      totalEnquiries,
      pendingEnquiries,
      completedEnquiries,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
