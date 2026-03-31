import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const product = await Product.create({
      name: body.name,
      description: body.description,
      category: body.category,
      images: body.images || [],
      customizationOptions: body.customizationOptions || { sizes: [], materials: [] },
      basePrice: body.basePrice,
      featured: body.featured || false,
      active: body.active !== false,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
