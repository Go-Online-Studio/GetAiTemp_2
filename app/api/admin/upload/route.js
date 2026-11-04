import { NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import { generateUploadSignature } from '@/lib/cloudinary';

export async function POST(request) {
  try {
    const user = getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { folder = 'getyouraiprompt', resourceType = 'auto' } = await request.json().catch(() => ({}));
    const signatureData = generateUploadSignature(folder, resourceType);

    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json({
        mock: true,
        message: 'Cloudinary credentials are not configured in environment variables. Upload is in mock/preview mode.',
        folder,
        timestamp: signatureData.timestamp,
      });
    }

    return NextResponse.json(signatureData);
  } catch (error) {
    console.error('Signature generation error:', error);
    return NextResponse.json({ error: 'Failed to generate upload signature' }, { status: 500 });
  }
}
