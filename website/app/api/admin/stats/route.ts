import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import Portfolio from '@/models/Portfolio';
import Enquiry from '@/models/Enquiry';
import AnalyticsEvent from '@/models/AnalyticsEvent';
import { requireAdminSession } from '@/lib/admin-auth';

export async function GET() {
  try {
    const session = await requireAdminSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    const fourteenDaysAgo = new Date(now);
    fourteenDaysAgo.setDate(now.getDate() - 14);
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const [totalServices, totalPortfolio, totalEnquiries] = await Promise.all([
      Product.countDocuments(),
      Portfolio.countDocuments(),
      Enquiry.countDocuments(),
    ]);

    const [
      pendingEnquiries,
      completedEnquiries,
      enquiriesLast7Days,
      enquiriesPrevious7Days,
      servicesLast30Days,
      portfolioLast30Days,
      requestQuoteViews30Days,
      enquirySubmissions30Days,
      topServices,
      trafficBreakdown,
    ] = await Promise.all([
      Enquiry.countDocuments({ status: 'pending' }),
      Enquiry.countDocuments({ status: 'completed' }),
      Enquiry.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Enquiry.countDocuments({ createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo } }),
      Product.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Portfolio.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      AnalyticsEvent.countDocuments({ eventType: 'request_quote_view', createdAt: { $gte: thirtyDaysAgo } }),
      AnalyticsEvent.countDocuments({ eventType: 'enquiry_submission', createdAt: { $gte: thirtyDaysAgo } }),
      Enquiry.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
          $project: {
            serviceName: {
              $ifNull: ['$productName.en', '$productName'],
            },
          },
        },
        { $match: { serviceName: { $type: 'string', $ne: '' } } },
        { $group: { _id: '$serviceName', count: { $sum: 1 } } },
        { $sort: { count: -1, _id: 1 } },
        { $limit: 5 },
      ]),
      AnalyticsEvent.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo }, source: { $exists: true, $ne: '' } } },
        {
          $group: {
            _id: '$source',
            views: {
              $sum: {
                $cond: [{ $eq: ['$eventType', 'request_quote_view'] }, 1, 0],
              },
            },
            submissions: {
              $sum: {
                $cond: [{ $eq: ['$eventType', 'enquiry_submission'] }, 1, 0],
              },
            },
          },
        },
        { $sort: { submissions: -1, views: -1, _id: 1 } },
        { $limit: 6 },
      ]),
    ]);

    const enquiryConversionRate =
      requestQuoteViews30Days === 0
        ? 0
        : Math.round((enquirySubmissions30Days / requestQuoteViews30Days) * 100);

    return NextResponse.json({
      totalServices,
      totalPortfolio,
      totalEnquiries,
      pendingEnquiries,
      completedEnquiries,
      enquiriesLast7Days,
      enquiriesPrevious7Days,
      servicesLast30Days,
      portfolioLast30Days,
      requestQuoteViews30Days,
      enquirySubmissions30Days,
      enquiryConversionRate,
      topServices: topServices.map((entry) => ({ name: entry._id, count: entry.count })),
      trafficBreakdown: trafficBreakdown.map((entry) => ({
        source: entry._id,
        views: entry.views,
        submissions: entry.submissions,
        conversionRate: entry.views > 0 ? Math.round((entry.submissions / entry.views) * 100) : 0,
      })),
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
