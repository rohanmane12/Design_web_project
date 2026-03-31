import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Portfolio from '@/models/Portfolio';
import { requireAdminSession } from '@/lib/admin-auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdminSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
    const session = await requireAdminSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const existingPortfolio = await Portfolio.findById(id);

    if (!existingPortfolio) {
      return NextResponse.json({ error: 'Portfolio item not found' }, { status: 404 });
    }

    const updatePayload = {
      title: body.title ?? existingPortfolio.title,
      description: body.description ?? existingPortfolio.description,
      category: body.category ?? existingPortfolio.category,
      images: body.images ?? existingPortfolio.images,
      featured: body.featured ?? existingPortfolio.featured,
      active: body.active ?? existingPortfolio.active,
    };

    const portfolio = await Portfolio.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

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
    const session = await requireAdminSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
