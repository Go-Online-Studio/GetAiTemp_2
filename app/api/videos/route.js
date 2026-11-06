import { NextResponse } from 'next/server';
import { getVideos } from '@/lib/data-source';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '8', 10)));
    const category = searchParams.get('category');
    const aspectRatio = searchParams.get('aspectRatio');
    const aiTool = searchParams.get('aiTool');
    const sort = searchParams.get('sort') || 'latest';
    const search = searchParams.get('search');
    const featured = searchParams.get('featured') === 'true';

    // prompt is NEVER included in public list (select: false)
    const result = await getVideos({
      page,
      limit,
      category,
      aspectRatio,
      aiTool,
      sort,
      search,
      featured: featured || undefined,
      status: 'published',
      includePrompt: false,
    });

    return NextResponse.json(
      {
        success: true,
        data: result.videos,
        pagination: {
          page: result.page,
          limit,
          total: result.total,
          totalPages: result.totalPages,
          hasMore: result.hasMore,
        },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}
