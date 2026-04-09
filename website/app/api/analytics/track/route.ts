import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import AnalyticsEvent from '@/models/AnalyticsEvent';
import { getUtmFields, inferTrafficSource } from '@/lib/analytics';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const currentUrl = typeof body.currentUrl === 'string' ? body.currentUrl : undefined;
    const referrer = typeof body.referrer === 'string' ? body.referrer : request.headers.get('referer') || undefined;
    const path = typeof body.path === 'string' ? body.path : '/';
    const utmFields = getUtmFields(currentUrl);
    const utmSource = typeof body.utmSource === 'string' ? body.utmSource : utmFields.utmSource;
    const utmMedium = typeof body.utmMedium === 'string' ? body.utmMedium : utmFields.utmMedium;
    const utmCampaign = typeof body.utmCampaign === 'string' ? body.utmCampaign : utmFields.utmCampaign;
    const source = inferTrafficSource({ currentUrl, referrer, utmSource });

    await AnalyticsEvent.create({
      eventType: body.eventType === 'enquiry_submission' ? 'enquiry_submission' : 'request_quote_view',
      path,
      currentUrl,
      referrer,
      source,
      utmSource,
      utmMedium,
      utmCampaign,
      productId: typeof body.productId === 'string' ? body.productId : undefined,
      productName: typeof body.productName === 'string' ? body.productName : undefined,
      metadata: typeof body.metadata === 'object' && body.metadata ? body.metadata : undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error tracking analytics event:', error);
    return NextResponse.json({ error: 'Failed to track analytics event' }, { status: 500 });
  }
}
