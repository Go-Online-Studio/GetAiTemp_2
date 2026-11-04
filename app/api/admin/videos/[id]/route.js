import { NextResponse } from 'next/server';
import { getVideoById, updateVideo, deleteVideo } from '@/lib/data-source';
import { getAuthUserFromRequest } from '@/lib/auth';
import { videoSchema } from '@/lib/validations';
import cloudinary from '@/lib/cloudinary';

export async function GET(request, { params }) {
  try {
    const user = getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const video = await getVideoById(id, true);

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json({ video });
  } catch (error) {
    console.error('Error fetching admin video:', error);
    return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const user = getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const validation = videoSchema.partial().safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0]?.message || 'Validation failed' },
        { status: 400 }
      );
    }

    const updated = await updateVideo(id, validation.data);

    if (!updated) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      video: updated,
    });
  } catch (error) {
    console.error('Update video error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update video' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const existing = await getVideoById(id, false);

    // Optional Cloudinary cleanup
    if (existing && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      if (existing.videoPublicId) {
        try {
          await cloudinary.uploader.destroy(existing.videoPublicId, { resource_type: 'video' });
        } catch (err) {}
      }
      if (existing.thumbnailPublicId) {
        try {
          await cloudinary.uploader.destroy(existing.thumbnailPublicId, { resource_type: 'image' });
        } catch (err) {}
      }
    }

    await deleteVideo(id);

    return NextResponse.json({
      success: true,
      message: 'Video deleted successfully',
    });
  } catch (error) {
    console.error('Delete video error:', error);
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
  }
}
