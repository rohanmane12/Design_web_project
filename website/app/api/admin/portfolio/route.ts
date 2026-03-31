import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Portfolio from '@/models/Portfolio';

export async function GET() {
  try {
    await connectDB();
    const portfolios = await Portfolio.find().sort({ createdAt: -1 });
    return NextResponse.json(portfolios);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const portfolio = await Portfolio.create({
      title: body.title,
      description: body.description,
      category: body.category,
      images: body.images || [],
      featured: body.featured || false,
      active: body.active !== false,
    });

    return NextResponse.json(portfolio, { status: 201 });
  } catch (error) {
    console.error('Error creating portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to create portfolio' },
      { status: 500 }
    );
  }
}
