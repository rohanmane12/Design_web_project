import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
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
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service' },
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

    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const updatePayload = {
      name: body.name ?? existingProduct.name,
      description: body.description ?? existingProduct.description,
      category: body.category ?? existingProduct.category,
      images: body.images ?? existingProduct.images,
      customizationOptions: body.customizationOptions ?? existingProduct.customizationOptions,
      basePrice: body.basePrice ?? existingProduct.basePrice,
      featured: body.featured ?? existingProduct.featured,
      active: body.active ?? existingProduct.active,
    };

    const product = await Product.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Failed to update service' },
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
    
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}
