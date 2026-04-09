import { NextRequest, NextResponse } from 'next/server';
import { getUtmFields, inferTrafficSource } from '@/lib/analytics';

// GET all enquiries
export async function GET() {
  try {
    const { connectDB } = await import('@/lib/db');
    const Enquiry = (await import('@/models/Enquiry')).default;
    
    await connectDB();
    const enquiries = await Enquiry.find()
      .sort({ createdAt: -1 })
      .populate('productId', 'name category');
    return NextResponse.json(enquiries);
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enquiries' },
      { status: 500 }
    );
  }
}

// POST create new enquiry
export async function POST(request: NextRequest) {
  try {
    const { connectDB } = await import('@/lib/db');
    const Enquiry = (await import('@/models/Enquiry')).default;
    const AnalyticsEvent = (await import('@/models/AnalyticsEvent')).default;
    
    await connectDB();
    const body = await request.json();
    const currentUrl = typeof body.analytics?.landingPage === 'string' ? body.analytics.landingPage : undefined;
    const referrer = typeof body.analytics?.referrer === 'string' ? body.analytics.referrer : request.headers.get('referer') || undefined;
    const utmFields = getUtmFields(currentUrl);
    const utmSource = typeof body.analytics?.utmSource === 'string' ? body.analytics.utmSource : utmFields.utmSource;
    const utmMedium = typeof body.analytics?.utmMedium === 'string' ? body.analytics.utmMedium : utmFields.utmMedium;
    const utmCampaign = typeof body.analytics?.utmCampaign === 'string' ? body.analytics.utmCampaign : utmFields.utmCampaign;
    const source = inferTrafficSource({ currentUrl, referrer, utmSource });

    const enquiryPayload = {
      ...body,
      analytics: {
        source,
        referrer,
        landingPage: currentUrl,
        utmSource,
        utmMedium,
        utmCampaign,
      },
    };

    const enquiry = await Enquiry.create(enquiryPayload);

    await AnalyticsEvent.create({
      eventType: 'enquiry_submission',
      path: '/request-quote',
      currentUrl,
      referrer,
      source,
      utmSource,
      utmMedium,
      utmCampaign,
      productId: enquiry.productId,
      productName:
        typeof enquiry.productName === 'string'
          ? enquiry.productName
          : enquiry.productName?.en || enquiry.productName?.hi || enquiry.productName?.mr,
      metadata: {
        status: enquiry.status,
      },
    });
    
    // Return enquiry data for WhatsApp message
    return NextResponse.json({
      ...enquiry.toObject(),
      message: 'Enquiry created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to create enquiry' },
      { status: 500 }
    );
  }
}
