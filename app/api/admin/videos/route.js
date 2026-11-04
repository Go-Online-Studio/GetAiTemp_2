import { NextResponse } from 'next/server';
import { getVideos, createVideo } from '@/lib/data-source';
import { getAuthUserFromRequest } from '@/lib/auth';
import { videoSchema } from '@/lib/validations';

export async function GET(request) {
  try {
    const user = getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    const result = await getVideos({
      page,
      limit,
      search,
      status: status === 'all' ? null : status,
      includePrompt: true, // admin can see prompts
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Admin videos list error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin videos' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const validation = videoSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0]?.message || 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    const newVideo = await createVideo({
      ...validation.data,
      slug: validation.data.slug.toLowerCase(),
    });

    return NextResponse.json({
      success: true,
      video: newVideo,
    }, { status: 201 });
  } catch (error) {
    console.error('Admin create video error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create video' }, { status: 500 });
  }
}
