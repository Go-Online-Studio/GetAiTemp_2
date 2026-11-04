import { NextResponse } from 'next/server';
import { getVideos } from '@/lib/data-source';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)));
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured') === 'true';

    // prompt is NEVER included in public list
    const result = await getVideos({
      page,
      limit,
      category,
      search,
      featured: featured || undefined,
      status: 'published',
      includePrompt: false,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}
