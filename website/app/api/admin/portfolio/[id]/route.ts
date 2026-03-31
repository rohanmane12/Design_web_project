import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Portfolio from '@/models/Portfolio';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const portfolio = await Portfolio.findById(id);
    
    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio item not found' }, { status: 404 });
    }
    
    return NextResponse.json(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    
    const portfolio = await Portfolio.findByIdAndUpdate(
      id,
      {
        title: body.title,
        description: body.description,
        category: body.category,
        images: body.images,
        featured: body.featured,
        active: body.active,
      },
      { new: true, runValidators: true }
    );
    
    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio item not found' }, { status: 404 });
    }
    
    return NextResponse.json(portfolio);
  } catch (error) {
    console.error('Error updating portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to update portfolio' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const portfolio = await Portfolio.findByIdAndDelete(id);
    
    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio item not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Portfolio item deleted successfully' });
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to delete portfolio' },
      { status: 500 }
    );
  }
}
