import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const cloudinary = (await import('@/lib/cloudinary')).default;
    
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert buffer to base64
    const base64File = buffer.toString('base64');
    const fileUri = `data:${file.type};base64,${base64File}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileUri, {
      folder: 'design-concept/uploads',
      resource_type: 'auto',
    });

    return NextResponse.json({
      secure_url: result.secure_url,
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
